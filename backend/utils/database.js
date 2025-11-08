const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../data/ilerai.db');
let db;

const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      console.log('📊 Connected to SQLite database');
      
      // Create tables
      createTables().then(resolve).catch(reject);
    });
  });
};

const createTables = () => {
  return new Promise((resolve, reject) => {
    const queries = [
      // PHC table
      `CREATE TABLE IF NOT EXISTS phcs (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        phone TEXT NOT NULL,
        status TEXT DEFAULT 'open',
        services TEXT,
        hours TEXT DEFAULT '8:00 AM - 5:00 PM',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Patients table
      `CREATE TABLE IF NOT EXISTS patients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT UNIQUE NOT NULL,
        pin TEXT NOT NULL,
        phc_id TEXT,
        risk_level TEXT DEFAULT 'low',
        next_appointment DATETIME,
        last_visit DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (phc_id) REFERENCES phcs (id)
      )`,
      

      
      // USSD sessions table
      `CREATE TABLE IF NOT EXISTS ussd_sessions (
        session_id TEXT PRIMARY KEY,
        phone_number TEXT NOT NULL,
        current_menu TEXT DEFAULT 'main',
        user_data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Messages table
      `CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        phone_number TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'sms',
        status TEXT DEFAULT 'sent',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Staff table
      `CREATE TABLE IF NOT EXISTS staff (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phc_id TEXT,
        verification_token TEXT,
        email_verified INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (phc_id) REFERENCES phcs (id)
      )`,
      

      
      // Email verification tokens
      `CREATE TABLE IF NOT EXISTS verification_tokens (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        token TEXT NOT NULL,
        type TEXT DEFAULT 'email_verification',
        expires_at DATETIME NOT NULL,
        used BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];
    
    let completed = 0;
    queries.forEach((query, index) => {
      db.run(query, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.error(`Error creating table ${index}:`, err);
          reject(err);
          return;
        }
        completed++;
        if (completed === queries.length) {
          console.log('✅ Database tables created successfully');
          seedData().then(resolve).catch(reject);
        }
      });
    });
  });
};

const seedData = () => {
  return new Promise((resolve, reject) => {
    // Insert sample PHCs
    const phcs = [
      {
        id: 'phc-001',
        name: 'Central PHC Ikeja',
        location: 'Ikeja, Lagos',
        phone: '+234-801-234-5678',
        status: 'open',
        services: JSON.stringify(['Immunization', 'Antenatal', 'General Consultation']),
        hours: '8:00 AM - 5:00 PM'
      },
      {
        id: 'phc-002',
        name: 'Community Health Center',
        location: 'Victoria Island, Lagos',
        phone: '+234-802-345-6789',
        status: 'open',
        services: JSON.stringify(['Family Planning', 'Child Health', 'Malaria Treatment']),
        hours: '7:00 AM - 6:00 PM'
      },
      {
        id: 'phc-003',
        name: 'Primary Care Clinic',
        location: 'Surulere, Lagos',
        phone: '+234-803-456-7890',
        status: 'closed',
        services: JSON.stringify(['General Consultation', 'Immunization']),
        hours: '9:00 AM - 4:00 PM'
      }
    ];
    
    // Insert sample staff
    const staff = [
      {
        id: 'staff-123',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@phc.gov.ng',
        password: '$2b$10$hash',
        phc_id: 'phc-001',
        email_verified: 1
      },
      {
        id: 'staff-002',
        name: 'Dr. Ahmed Musa',
        email: 'ahmed.musa@phc.gov.ng',
        password: '$2b$10$hash2',
        phc_id: 'phc-002',
        email_verified: 1
      }
    ];
    
    // Insert sample patients
    const patients = [
      {
        id: 'patient-123',
        name: 'Amina Ibrahim',
        phone: '08012345678',
        pin: '1234',
        phc_id: 'phc-001',
        risk_level: 'high',
        next_appointment: '2024-01-15 10:00:00',
        last_visit: '2023-12-01 14:30:00'
      },
      {
        id: 'patient-456',
        name: 'Chidi Okafor',
        phone: '08023456789',
        pin: '5678',
        phc_id: 'phc-001',
        risk_level: 'low',
        next_appointment: '2024-01-16 11:00:00',
        last_visit: '2024-01-02 09:15:00'
      },
      {
        id: 'patient-789',
        name: 'Fatima Yusuf',
        phone: '08034567890',
        pin: '9876',
        phc_id: 'phc-002',
        risk_level: 'medium',
        next_appointment: '2024-01-17 14:00:00',
        last_visit: '2024-01-01 16:45:00'
      }
    ];
    
    let insertCount = 0;
    const totalInserts = phcs.length + patients.length + staff.length;
    
    // Insert PHCs
    phcs.forEach(phc => {
      db.run(
        `INSERT OR IGNORE INTO phcs (id, name, location, phone, status, services, hours) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [phc.id, phc.name, phc.location, phc.phone, phc.status, phc.services, phc.hours],
        (err) => {
          if (err) console.error('Error inserting PHC:', err);
          insertCount++;
          if (insertCount === totalInserts) {
            console.log('🌱 Sample data seeded successfully');
            resolve();
          }
        }
      );
    });
    
    // Insert staff
    staff.forEach(staffMember => {
      db.run(
        `INSERT OR IGNORE INTO staff (id, name, email, password, phc_id, email_verified) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [staffMember.id, staffMember.name, staffMember.email, staffMember.password, staffMember.phc_id, staffMember.email_verified || 0],
        (err) => {
          if (err) console.error('Error inserting staff:', err);
          insertCount++;
          if (insertCount === totalInserts) {
            console.log('🌱 Sample data seeded successfully');
            resolve();
          }
        }
      );
    });
    
    // Insert patients
    patients.forEach(patient => {
      db.run(
        `INSERT OR IGNORE INTO patients (id, name, phone, pin, phc_id, risk_level, next_appointment, last_visit) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [patient.id, patient.name, patient.phone, patient.pin, patient.phc_id, patient.risk_level, patient.next_appointment, patient.last_visit],
        (err) => {
          if (err) console.error('Error inserting patient:', err);
          insertCount++;
          if (insertCount === totalInserts) {
            console.log('🌱 Sample data seeded successfully');
            resolve();
          }
        }
      );
    });
  });
};

const getDB = () => db;

module.exports = { initDatabase, getDB };