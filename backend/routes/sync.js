const express = require('express');
const { getDB } = require('../utils/database');

const router = express.Router();

// POST /api/sync/patient-activity - Track patient activity
router.post('/patient-activity', (req, res) => {
  const { patientId, activity, metadata } = req.body;
  
  if (!patientId || !activity) {
    return res.status(400).json({ error: 'Patient ID and activity are required' });
  }
  
  // Emit to staff room
  const io = req.app.get('io');
  if (io) {
    io.to('staff-room').emit('patient-data-updated', {
      type: 'patient_activity',
      patientId,
      activity,
      metadata,
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({ success: true, message: 'Activity tracked' });
});

// POST /api/sync/staff-action - Track staff actions affecting patients
router.post('/staff-action', (req, res) => {
  const { patientId, action, message, data } = req.body;
  
  if (!patientId || !action) {
    return res.status(400).json({ error: 'Patient ID and action are required' });
  }
  
  // Emit to specific patient
  const io = req.app.get('io');
  if (io) {
    io.to(`patient-${patientId}`).emit('staff-data-updated', {
      type: action,
      patientId,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({ success: true, message: 'Action synced to patient' });
});

// GET /api/sync/status - Get sync status
router.get('/status', (req, res) => {
  const io = req.app.get('io');
  const connectedClients = io ? io.engine.clientsCount : 0;
  
  res.json({
    success: true,
    data: {
      connectedClients,
      serverTime: new Date().toISOString(),
      syncEnabled: true
    }
  });
});

module.exports = router;