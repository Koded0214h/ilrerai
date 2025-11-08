const express = require('express');
const { getDB } = require('../utils/database');
const smsService = require('../utils/sms-service');
const voiceService = require('../utils/voice-service');

const router = express.Router();

// POST /api/notifications/send-sms
router.post('/send-sms', async (req, res) => {
  const { patientId, message, type } = req.body;
  const db = getDB();

  try {
    db.get('SELECT * FROM patients WHERE id = ?', [patientId], async (err, patient) => {
      if (err || !patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      let result;
      switch (type) {
        case 'appointment':
          result = await smsService.sendAppointmentReminder(patient);
          break;
        case 'medication':
          const medication = { name: 'Medication', dosage: '500mg', instructions: 'food' };
          result = await smsService.sendMedicationReminder(patient, medication);
          break;
        case 'health-tip':
          result = await smsService.sendHealthTip(patient, message);
          break;
        default:
          result = await smsService.sendSMS(patient.phone, message, patient.language);
      }

      if (result.success) {
        // Log message in database
        db.run(
          'INSERT INTO messages (id, phone_number, message, type, status) VALUES (?, ?, ?, ?, ?)',
          [require('uuid').v4(), patient.phone, message, 'sms', 'sent']
        );
      }

      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});

// POST /api/notifications/send-voice
router.post('/send-voice', async (req, res) => {
  const { patientId, message, type } = req.body;
  const db = getDB();

  try {
    db.get('SELECT * FROM patients WHERE id = ?', [patientId], async (err, patient) => {
      if (err || !patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      let result;
      switch (type) {
        case 'appointment':
          result = await voiceService.callAppointmentReminder(patient);
          break;
        case 'medication':
          const medication = { name: 'Medication', dosage: '500mg', instructions: 'food' };
          result = await voiceService.callMedicationReminder(patient, medication);
          break;
        default:
          result = await voiceService.makeVoiceCall(patient.phone, message, patient.language);
      }

      if (result.success) {
        // Log call in database
        db.run(
          'INSERT INTO messages (id, phone_number, message, type, status) VALUES (?, ?, ?, ?, ?)',
          [require('uuid').v4(), patient.phone, message, 'voice', 'sent']
        );
      }

      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to make voice call' });
  }
});

// GET /api/voice/twiml - Generate TwiML for voice calls
router.get('/twiml', (req, res) => {
  const { message, language } = req.query;
  const twiml = voiceService.generateTwiML(message, language);
  
  res.type('text/xml');
  res.send(twiml);
});

// POST /api/notifications/bulk-send
router.post('/bulk-send', async (req, res) => {
  const { message, type, method, language } = req.body;
  const db = getDB();

  try {
    db.all('SELECT * FROM patients WHERE language = ? OR language IS NULL', [language || 'english'], async (err, patients) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch patients' });
      }

      const results = [];
      for (const patient of patients) {
        let result;
        if (method === 'voice') {
          result = await voiceService.makeVoiceCall(patient.phone, message, patient.language);
        } else {
          result = await smsService.sendSMS(patient.phone, message, patient.language);
        }
        results.push({ patientId: patient.id, ...result });
      }

      res.json({ success: true, results });
    });
  } catch (error) {
    res.status(500).json({ error: 'Bulk send failed' });
  }
});

module.exports = router;