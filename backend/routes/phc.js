const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDB } = require('../utils/database');

const router = express.Router();

// GET /api/phc/list - Get all PHCs
router.get('/list', (req, res) => {
  const db = getDB();
  const { location, status } = req.query;
  
  let query = 'SELECT * FROM phcs';
  let params = [];
  
  if (location || status) {
    query += ' WHERE';
    const conditions = [];
    
    if (location) {
      conditions.push(' location LIKE ?');
      params.push(`%${location}%`);
    }
    
    if (status) {
      conditions.push(' status = ?');
      params.push(status);
    }
    
    query += conditions.join(' AND');
  }
  
  query += ' ORDER BY name';
  
  try {
    const stmt = db.prepare(query);
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }

    // Parse services JSON
    const phcs = rows.map(row => ({
      ...row,
      services: JSON.parse(row.services || '[]')
    }));

    res.json({ success: true, data: phcs });
  } catch (err) {
    console.error('Error fetching PHCs:', err);
    return res.status(500).json({ error: 'Failed to fetch PHCs' });
  }
});

// PUT /api/phc/update - Update PHC information
router.put('/update', (req, res) => {
  const db = getDB();
  const { id, name, location, phone, status, services, hours } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: 'PHC ID is required' });
  }
  
  const servicesJson = JSON.stringify(services || []);
  
  db.run(
    `UPDATE phcs SET 
     name = COALESCE(?, name),
     location = COALESCE(?, location),
     phone = COALESCE(?, phone),
     status = COALESCE(?, status),
     services = COALESCE(?, services),
     hours = COALESCE(?, hours)
     WHERE id = ?`,
    [name, location, phone, status, servicesJson, hours, id],
    function(err) {
      if (err) {
        console.error('Error updating PHC:', err);
        return res.status(500).json({ error: 'Failed to update PHC' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'PHC not found' });
      }
      
      res.json({ 
        success: true, 
        message: 'PHC updated successfully',
        changes: this.changes 
      });
    }
  );
});

// POST /api/phc/create - Create new PHC
router.post('/create', (req, res) => {
  const db = getDB();
  const { name, location, phone, status = 'open', services = [], hours = '8:00 AM - 5:00 PM' } = req.body;
  
  if (!name || !location || !phone) {
    return res.status(400).json({ error: 'Name, location, and phone are required' });
  }
  
  const id = uuidv4();
  const servicesJson = JSON.stringify(services);
  
  db.run(
    `INSERT INTO phcs (id, name, location, phone, status, services, hours) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, name, location, phone, status, servicesJson, hours],
    function(err) {
      if (err) {
        console.error('Error creating PHC:', err);
        return res.status(500).json({ error: 'Failed to create PHC' });
      }
      
      res.status(201).json({ 
        success: true, 
        message: 'PHC created successfully',
        data: { id, name, location, phone, status, services, hours }
      });
    }
  );
});

// GET /api/phc/:id - Get specific PHC
router.get('/:id', (req, res) => {
  const db = getDB();
  const { id } = req.params;

  try {
    const stmt = db.prepare('SELECT * FROM phcs WHERE id = ?');
    stmt.bind([id]);
    const row = stmt.step() ? stmt.getAsObject() : null;

    if (!row) {
      return res.status(404).json({ error: 'PHC not found' });
    }

    const phc = {
      ...row,
      services: JSON.parse(row.services || '[]')
    };

    res.json({ success: true, data: phc });
  } catch (err) {
    console.error('Error fetching PHC:', err);
    return res.status(500).json({ error: 'Failed to fetch PHC' });
  }
});

module.exports = router;