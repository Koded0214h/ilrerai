const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { getDB } = require('../utils/database');

const router = express.Router();

// POST /api/auth/register - Staff registration
router.post('/register', async (req, res) => {
  const db = getDB();
  const { name, email, password, phc_id } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const staffId = uuidv4();
    
    db.run(
      `INSERT INTO staff (id, name, email, password, phc_id, email_verified) 
       VALUES (?, ?, ?, ?, ?, 1)`,
      [staffId, name, email, hashedPassword, phc_id],
      function(err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({ error: 'Email already registered' });
          }
          console.error('Error registering staff:', err);
          return res.status(500).json({ error: 'Registration failed' });
        }
        
        console.log(`📧 Staff registration: ${name} (${email})`);
        
        res.status(201).json({ 
          success: true, 
          message: 'Registration successful! You can now log in.',
          data: { id: staffId, name, email }
        });
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login - Staff login
router.post('/login', (req, res) => {
  const db = getDB();
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  db.get(
    'SELECT * FROM staff WHERE email = ?',
    [email],
    async (err, staff) => {
      if (err) {
        console.error('Error during staff login:', err);
        return res.status(500).json({ error: 'Login failed' });
      }
      
      if (!staff) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      

      
      try {
        const validPassword = await bcrypt.compare(password, staff.password);
        if (!validPassword) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        const { password: _, verification_token, ...staffData } = staff;
        
        res.json({ 
          success: true, 
          message: 'Login successful',
          data: staffData
        });
      } catch (error) {
        console.error('Password comparison error:', error);
        res.status(500).json({ error: 'Login failed' });
      }
    }
  );
});



module.exports = router;