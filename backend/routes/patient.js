const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDB } = require('../utils/database');

const router = express.Router();

// POST /api/patient/register - Register new patient
router.post('/register', (req, res) => {
  const db = getDB();
  const { name, phone, pin, phc_id, risk_level = 'low' } = req.body;
  
  if (!name || !phone || !pin) {
    return res.status(400).json({ error: 'Name, phone, and PIN are required' });
  }
  
  if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
    return res.status(400).json({ error: 'PIN must be 4 digits' });
  }
  
  const id = uuidv4();
  
  db.run(
    `INSERT INTO patients (id, name, phone, pin, phc_id, risk_level) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, name, phone, pin, phc_id, risk_level],
    function(err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          return res.status(409).json({ error: 'Phone number already registered' });
        }
        console.error('Error registering patient:', err);
        return res.status(500).json({ error: 'Failed to register patient' });
      }
      
      console.log(`📱 Patient registration: ${name} (${phone})`);
      
      // Notify staff of new patient registration
      const io = req.app.get('io');
      if (io) {
        io.to('staff-room').emit('patient-data-updated', {
          type: 'new_patient_registered',
          patientId: id,
          patientName: name,
          message: `New patient ${name} has registered`
        });
      }
      
      res.status(201).json({ 
        success: true, 
        message: 'Registration successful! You can now log in.',
        data: { id, name, phone }
      });
    }
  );
});



// POST /api/patient/login - Patient login with phone and PIN
router.post('/login', (req, res) => {
  const db = getDB();
  const { phone, pin } = req.body;
  
  if (!phone || !pin) {
    return res.status(400).json({ error: 'Phone and PIN are required' });
  }
  
  db.get(
    'SELECT * FROM patients WHERE phone = ? AND pin = ?',
    [phone, pin],
    (err, row) => {
      if (err) {
        console.error('Error during patient login:', err);
        return res.status(500).json({ error: 'Login failed' });
      }
      
      if (!row) {
        return res.status(401).json({ error: 'Invalid phone number or PIN' });
      }
      

      
      // Don't return PIN in response
      const { pin: _, verification_code, ...patient } = row;
      
      // Notify staff that patient is now active
      const io = req.app.get('io');
      if (io) {
        io.to('staff-room').emit('patient-data-updated', {
          type: 'patient_login',
          patientId: patient.id,
          patientName: patient.name,
          message: `${patient.name} has logged in`
        });
      }
      
      res.json({ 
        success: true, 
        message: 'Login successful',
        data: patient
      });
    }
  );
});

// GET /api/patient/list - Get all patients (for staff)
router.get('/list', (req, res) => {
  const db = getDB();
  const { phc_id, risk_level } = req.query;
  
  let query = `
    SELECT p.*, ph.name as phc_name 
    FROM patients p 
    LEFT JOIN phcs ph ON p.phc_id = ph.id
  `;
  let params = [];
  
  if (phc_id || risk_level) {
    query += ' WHERE';
    const conditions = [];
    
    if (phc_id) {
      conditions.push(' p.phc_id = ?');
      params.push(phc_id);
    }
    
    if (risk_level) {
      conditions.push(' p.risk_level = ?');
      params.push(risk_level);
    }
    
    query += conditions.join(' AND');
  }
  
  query += ' ORDER BY p.name';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching patients:', err);
      return res.status(500).json({ error: 'Failed to fetch patients' });
    }
    
    // Remove PINs from response
    const patients = rows.map(({ pin, ...patient }) => patient);
    
    res.json({ success: true, data: patients });
  });
});

// POST /api/patient/remind - Send reminder to patients
router.post('/remind', (req, res) => {
  const db = getDB();
  const { patient_ids, message, type = 'sms' } = req.body;
  
  if (!patient_ids || !Array.isArray(patient_ids) || patient_ids.length === 0) {
    return res.status(400).json({ error: 'Patient IDs array is required' });
  }
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  // Get patient phone numbers
  const placeholders = patient_ids.map(() => '?').join(',');
  
  db.all(
    `SELECT id, phone, name FROM patients WHERE id IN (${placeholders})`,
    patient_ids,
    (err, patients) => {
      if (err) {
        console.error('Error fetching patients for reminder:', err);
        return res.status(500).json({ error: 'Failed to fetch patients' });
      }
      
      if (patients.length === 0) {
        return res.status(404).json({ error: 'No patients found' });
      }
      
      // Simulate sending messages (in real app, integrate with SMS API)
      const messagePromises = patients.map(patient => {
        return new Promise((resolve, reject) => {
          const messageId = uuidv4();
          const personalizedMessage = message.replace('{name}', patient.name);
          
          db.run(
            `INSERT INTO messages (id, phone_number, message, type, status) 
             VALUES (?, ?, ?, ?, ?)`,
            [messageId, patient.phone, personalizedMessage, type, 'sent'],
            (err) => {
              if (err) {
                console.error('Error saving message:', err);
                reject(err);
              } else {
                resolve({
                  patient_id: patient.id,
                  phone: patient.phone,
                  message: personalizedMessage,
                  status: 'sent'
                });
              }
            }
          );
        });
      });
      
      Promise.all(messagePromises)
        .then(results => {
          res.json({
            success: true,
            message: `Reminders sent to ${results.length} patients`,
            data: results
          });
        })
        .catch(error => {
          console.error('Error sending reminders:', error);
          res.status(500).json({ error: 'Failed to send some reminders' });
        });
    }
  );
});

// PUT /api/patient/:id - Update patient information
router.put('/:id', (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { name, phone, phc_id, risk_level, next_appointment } = req.body;
  
  db.run(
    `UPDATE patients SET 
     name = COALESCE(?, name),
     phone = COALESCE(?, phone),
     phc_id = COALESCE(?, phc_id),
     risk_level = COALESCE(?, risk_level),
     next_appointment = COALESCE(?, next_appointment)
     WHERE id = ?`,
    [name, phone, phc_id, risk_level, next_appointment, id],
    function(err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          return res.status(409).json({ error: 'Phone number already exists' });
        }
        console.error('Error updating patient:', err);
        return res.status(500).json({ error: 'Failed to update patient' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      
      // Emit real-time update to patient
      const io = req.app.get('io');
      if (io) {
        io.to(`patient-${id}`).emit('staff-data-updated', {
          type: 'patient_data_updated',
          patientId: id,
          message: 'Your information has been updated by staff',
          updatedFields: { name, phone, phc_id, risk_level, next_appointment }
        });
      }
      
      res.json({ 
        success: true, 
        message: 'Patient updated successfully',
        changes: this.changes 
      });
    }
  );
});

module.exports = router;