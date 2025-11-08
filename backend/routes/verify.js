const express = require('express');
const { getDB } = require('../utils/database');

const router = express.Router();

// POST /api/verify/phone - Verify patient phone number
router.post('/phone', (req, res) => {
  const db = getDB();
  const { phone, code } = req.body;
  
  if (!phone || !code) {
    return res.status(400).json({ error: 'Phone number and verification code are required' });
  }
  
  db.get(
    'SELECT * FROM patients WHERE phone = ? AND verification_code = ?',
    [phone, code],
    (err, patient) => {
      if (err) {
        console.error('Error during phone verification:', err);
        return res.status(500).json({ error: 'Verification failed' });
      }
      
      if (!patient) {
        return res.status(400).json({ error: 'Invalid verification code' });
      }
      
      // Check if code has expired
      const now = new Date();
      const expiresAt = new Date(patient.code_expires_at);
      
      if (now > expiresAt) {
        return res.status(400).json({ error: 'Verification code has expired' });
      }
      
      // Mark phone as verified
      db.run(
        'UPDATE patients SET phone_verified = 1, verification_code = NULL, code_expires_at = NULL WHERE id = ?',
        [patient.id],
        function(err) {
          if (err) {
            console.error('Error updating verification status:', err);
            return res.status(500).json({ error: 'Verification failed' });
          }
          
          res.json({ 
            success: true, 
            message: 'Phone number verified successfully. You can now log in.' 
          });
        }
      );
    }
  );
});

// POST /api/verify/resend-sms - Resend SMS verification code
router.post('/resend-sms', (req, res) => {
  const db = getDB();
  const { phone } = req.body;
  
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }
  
  db.get(
    'SELECT * FROM patients WHERE phone = ?',
    [phone],
    (err, patient) => {
      if (err) {
        console.error('Error finding patient:', err);
        return res.status(500).json({ error: 'Failed to resend verification code' });
      }
      
      if (!patient) {
        return res.status(404).json({ error: 'Phone number not found' });
      }
      
      if (patient.phone_verified) {
        return res.status(400).json({ error: 'Phone number already verified' });
      }
      
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      db.run(
        'UPDATE patients SET verification_code = ?, code_expires_at = ? WHERE id = ?',
        [newCode, expiresAt.toISOString(), patient.id],
        function(err) {
          if (err) {
            console.error('Error updating verification code:', err);
            return res.status(500).json({ error: 'Failed to resend verification code' });
          }
          
          console.log(`📱 SMS sent to ${phone}: Your verification code is ${newCode}`);
          
          res.json({ 
            success: true, 
            message: 'Verification code sent. Please check your SMS.' 
          });
        }
      );
    }
  );
});

module.exports = router;