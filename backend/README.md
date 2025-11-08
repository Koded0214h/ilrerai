# IlerAI PHC Backend API

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Check if API is running

### PHC Management
- `GET /api/phc/list` - Get all PHCs
- `GET /api/phc/:id` - Get specific PHC
- `PUT /api/phc/update` - Update PHC information
- `POST /api/phc/create` - Create new PHC

### Patient Management
- `POST /api/patient/register` - Register new patient
- `POST /api/patient/login` - Patient login
- `GET /api/patient/list` - Get all patients (staff only)
- `PUT /api/patient/:id` - Update patient
- `POST /api/patient/remind` - Send reminders to patients

### USSD Simulation
- `POST /api/ussd/session` - Handle USSD session
- `GET /api/ussd/simulate` - Get simulation instructions

## Sample API Calls

### Register Patient
```bash
curl -X POST http://localhost:5000/api/patient/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+234-901-234-5678",
    "pin": "1234",
    "phc_id": "phc-001"
  }'
```

### Update PHC Status
```bash
curl -X PUT http://localhost:5000/api/phc/update \
  -H "Content-Type: application/json" \
  -d '{
    "id": "phc-001",
    "status": "closed"
  }'
```

### Send Patient Reminder
```bash
curl -X POST http://localhost:5000/api/patient/remind \
  -H "Content-Type: application/json" \
  -d '{
    "patient_ids": ["1", "2"],
    "message": "Reminder: Your appointment is tomorrow at 10 AM. Please arrive 15 minutes early."
  }'
```

### USSD Simulation
```bash
# Start USSD session
curl -X POST http://localhost:5000/api/ussd/session \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session123",
    "phoneNumber": "+234-801-234-567",
    "text": ""
  }'

# Send menu option
curl -X POST http://localhost:5000/api/ussd/session \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session123",
    "phoneNumber": "+234-801-234-567",
    "text": "1"
  }'
```

## Database Schema

### PHCs Table
- id (TEXT PRIMARY KEY)
- name (TEXT)
- location (TEXT)
- phone (TEXT)
- status (TEXT) - 'open' or 'closed'
- services (TEXT) - JSON array
- hours (TEXT)
- created_at (DATETIME)

### Patients Table
- id (TEXT PRIMARY KEY)
- name (TEXT)
- phone (TEXT UNIQUE)
- pin (TEXT) - 4 digit PIN
- phc_id (TEXT)
- risk_level (TEXT) - 'low', 'medium', 'high'
- next_appointment (DATETIME)
- last_visit (DATETIME)
- created_at (DATETIME)

### USSD Sessions Table
- session_id (TEXT PRIMARY KEY)
- phone_number (TEXT)
- current_menu (TEXT)
- user_data (TEXT) - JSON
- created_at (DATETIME)

### Messages Table
- id (TEXT PRIMARY KEY)
- phone_number (TEXT)
- message (TEXT)
- type (TEXT) - 'sms', 'ussd'
- status (TEXT) - 'sent', 'failed'
- created_at (DATETIME)

## USSD Menu Structure

```
Main Menu (*347*22#)
├── 1. Find PHC
│   ├── 1. By Location
│   ├── 2. Open PHCs
│   └── 3. All PHCs
├── 2. My Info
│   ├── 1. Next Appointment
│   ├── 2. Medications
│   └── 3. PHC Contact
└── 3. Register
    └── Enter name, phone, PIN
```

## Demo Data

The system comes pre-loaded with:
- 3 sample PHCs in Lagos
- 2 sample patients
- Sample appointments and risk levels

## Production Deployment

1. Set environment variables
2. Use PostgreSQL/MySQL instead of SQLite
3. Add authentication middleware
4. Integrate real SMS/USSD providers (Twilio, Africa's Talking)
5. Add rate limiting and security headers