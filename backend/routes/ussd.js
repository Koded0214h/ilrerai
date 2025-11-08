const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDB } = require('../utils/database');

const router = express.Router();

// USSD Menu Structure
const USSD_MENUS = {
  main: {
    text: 'Welcome to IlerAI PHC\n1. Find Nearby PHCs\n2. Check Services\n3. Drug Availability\n4. Emergency Contact',
    options: {
      '1': 'nearby_phcs',
      '2': 'services',
      '3': 'drugs',
      '4': 'emergency'
    }
  },
  services: {
    text: 'Available Services:\n1. Antenatal Care\n2. Immunization\n3. Family Planning\n4. General Consultation\n0. Back to Main',
    options: {
      '1': 'antenatal',
      '2': 'immunization', 
      '3': 'family_planning',
      '4': 'consultation',
      '0': 'main'
    }
  },
  drugs: {
    text: 'Drug Stock Check:\n1. Paracetamol\n2. Amoxicillin\n3. ORS\n4. Malaria Drugs\n0. Back to Main',
    options: {
      '1': 'paracetamol_stock',
      '2': 'amoxicillin_stock',
      '3': 'ors_stock', 
      '4': 'malaria_stock',
      '0': 'main'
    }
  }
};

// POST /api/ussd - Main USSD handler
router.post('/', async (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;
  const db = getDB();

  try {
    // Get or create session
    let session = await getSession(db, sessionId, phoneNumber);
    const userInput = text.split('*').pop() || '';
    
    let response = '';
    let continueSession = true;

    if (text === '') {
      // First interaction - show main menu
      response = USSD_MENUS.main.text;
      session.current_menu = 'main';
    } else {
      response = await handleUserInput(db, session, userInput, phoneNumber);
      if (response.includes('Thank you') || response.includes('END')) {
        continueSession = false;
      }
    }

    // Update session
    await updateSession(db, sessionId, session.current_menu, JSON.stringify(session));

    // Format response for USSD gateway
    const ussdResponse = continueSession ? `CON ${response}` : `END ${response}`;
    
    res.set('Content-Type', 'text/plain');
    res.send(ussdResponse);

  } catch (error) {
    console.error('USSD Error:', error);
    res.set('Content-Type', 'text/plain');
    res.send('END Service temporarily unavailable. Please try again later.');
  }
});

async function handleUserInput(db, session, input, phoneNumber) {
  const currentMenu = session.current_menu || 'main';
  
  switch (currentMenu) {
    case 'main':
      return handleMainMenu(db, session, input, phoneNumber);
    case 'services':
      return handleServicesMenu(db, session, input);
    case 'drugs':
      return handleDrugsMenu(db, session, input);
    case 'nearby_phcs':
      return await handleNearbyPHCs(db, phoneNumber);
    default:
      session.current_menu = 'main';
      return USSD_MENUS.main.text;
  }
}

function handleMainMenu(db, session, input, phoneNumber) {
  const menu = USSD_MENUS.main;
  
  if (menu.options[input]) {
    const nextMenu = menu.options[input];
    session.current_menu = nextMenu;
    
    switch (nextMenu) {
      case 'nearby_phcs':
        return handleNearbyPHCs(db, phoneNumber);
      case 'services':
        return USSD_MENUS.services.text;
      case 'drugs':
        return USSD_MENUS.drugs.text;
      case 'emergency':
        return 'Emergency Contacts:\nAmbulance: 199\nFire: 199\nPolice: 199\nNational Emergency: 112\n\nThank you for using IlerAI PHC.';
      default:
        return menu.text;
    }
  }
  
  return 'Invalid option. Please try again.\n\n' + menu.text;
}

function handleServicesMenu(db, session, input) {
  const menu = USSD_MENUS.services;
  
  if (input === '0') {
    session.current_menu = 'main';
    return USSD_MENUS.main.text;
  }
  
  const serviceInfo = {
    '1': 'Antenatal Care:\nAvailable Mon-Fri 8AM-4PM\nServices: Checkups, Ultrasound, Health Education\nCost: Free\n\n0. Back to Services',
    '2': 'Immunization:\nAvailable Daily 8AM-2PM\nVaccines: BCG, DPT, Polio, Measles\nCost: Free\n\n0. Back to Services',
    '3': 'Family Planning:\nAvailable Mon-Fri 9AM-3PM\nServices: Counseling, Contraceptives\nCost: Free\n\n0. Back to Services',
    '4': 'General Consultation:\nAvailable Daily 8AM-5PM\nServices: Diagnosis, Treatment, Referrals\nCost: N500\n\n0. Back to Services'
  };
  
  if (serviceInfo[input]) {
    session.current_menu = 'service_detail';
    return serviceInfo[input];
  }
  
  return 'Invalid option.\n\n' + menu.text;
}

function handleDrugsMenu(db, session, input) {
  const menu = USSD_MENUS.drugs;
  
  if (input === '0') {
    session.current_menu = 'main';
    return USSD_MENUS.main.text;
  }
  
  const drugStock = {
    '1': 'Paracetamol: In Stock\nTablets 500mg available\nPrice: N50 per pack\n\n0. Back to Drugs',
    '2': 'Amoxicillin: In Stock\nCapsules 250mg available\nPrice: N200 per pack\n\n0. Back to Drugs',
    '3': 'ORS: In Stock\nOral Rehydration Salts\nPrice: N100 per sachet\n\n0. Back to Drugs',
    '4': 'Malaria Drugs: In Stock\nArtemether-Lumefantrine\nPrice: N800 per pack\n\n0. Back to Drugs'
  };
  
  if (drugStock[input]) {
    session.current_menu = 'drug_detail';
    return drugStock[input];
  }
  
  return 'Invalid option.\n\n' + menu.text;
}

async function handleNearbyPHCs(db, phoneNumber) {
  return new Promise((resolve) => {
    db.all('SELECT name, location, phone, status FROM phcs LIMIT 3', [], (err, phcs) => {
      if (err || !phcs.length) {
        resolve('No PHCs found in your area.\n\nThank you for using IlerAI PHC.');
        return;
      }
      
      let response = 'Nearby PHCs:\n\n';
      phcs.forEach((phc, index) => {
        response += `${index + 1}. ${phc.name}\n`;
        response += `Location: ${phc.location}\n`;
        response += `Phone: ${phc.phone}\n`;
        response += `Status: ${phc.status}\n\n`;
      });
      
      response += 'Thank you for using IlerAI PHC.';
      resolve(response);
    });
  });
}

async function getSession(db, sessionId, phoneNumber) {
  return new Promise((resolve) => {
    db.get(
      'SELECT * FROM ussd_sessions WHERE session_id = ?',
      [sessionId],
      (err, row) => {
        if (err || !row) {
          // Create new session
          const newSession = {
            session_id: sessionId,
            phone_number: phoneNumber,
            current_menu: 'main',
            user_data: '{}'
          };
          
          db.run(
            'INSERT INTO ussd_sessions (session_id, phone_number, current_menu, user_data) VALUES (?, ?, ?, ?)',
            [sessionId, phoneNumber, 'main', '{}']
          );
          
          resolve(newSession);
        } else {
          resolve({
            ...row,
            user_data: JSON.parse(row.user_data || '{}')
          });
        }
      }
    );
  });
}

async function updateSession(db, sessionId, currentMenu, userData) {
  return new Promise((resolve) => {
    db.run(
      'UPDATE ussd_sessions SET current_menu = ?, user_data = ? WHERE session_id = ?',
      [currentMenu, userData, sessionId],
      () => resolve()
    );
  });
}

// GET /api/ussd/test - Test USSD interface
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'USSD Service Active',
    code: '*347*22#',
    features: [
      'Find Nearby PHCs',
      'Check Available Services', 
      'Drug Stock Information',
      'Emergency Contacts'
    ]
  });
});

module.exports = router;