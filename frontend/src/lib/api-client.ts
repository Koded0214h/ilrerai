class ApiClient {
  private baseUrl = 'https://ilmeen-backend.onrender.com';

  // Dummy data for patients
  private dummyPatients = [
    {
      id: '1',
      name: 'John Doe',
      phone: '+1234567890',
      risk_level: 'low',
      next_appointment: '2024-01-15',
      medications: ['Aspirin', 'Lisinopril']
    },
    {
      id: '2',
      name: 'Jane Smith',
      phone: '+1234567891',
      risk_level: 'medium',
      next_appointment: '2024-01-10',
      medications: ['Metformin', 'Insulin']
    },
    {
      id: '3',
      name: 'Bob Johnson',
      phone: '+1234567892',
      risk_level: 'high',
      next_appointment: '2024-01-05',
      medications: ['Warfarin', 'Digoxin']
    }
  ];

  async get(endpoint: string) {
    // Return dummy data based on endpoint
    if (endpoint === '/api/patient/list') {
      return this.dummyPatients;
    }
    return { success: true, data: [] };
  }

  async post(endpoint: string, data: any) {
    // Simulate successful responses with dummy data
    if (endpoint === '/api/patient/remind') {
      return { success: true, message: 'Reminders sent successfully' };
    }
    if (endpoint === '/api/patient/login') {
      return { success: true, token: 'dummy-token', patient: this.dummyPatients[0] };
    }
    if (endpoint === '/api/patient/register') {
      return { success: true, message: 'Patient registered successfully' };
    }
    if (endpoint === '/api/patient/verify') {
      return { success: true, message: 'Patient verified successfully' };
    }
    if (endpoint === '/api/auth/register') {
      return { success: true, message: 'Staff registered successfully' };
    }
    if (endpoint === '/api/auth/login') {
      return { success: true, token: 'dummy-staff-token', user: { name: 'Staff User', email: data.email } };
    }
    return { success: true, data: {} };
  }

  async put(endpoint: string, data: any) {
    // Simulate successful update
    return { success: true, message: 'Patient updated successfully' };
  }

  async getPatients() {
    return this.dummyPatients;
  }

  async updatePatient(id: string, data: any) {
    return { success: true, message: 'Patient updated successfully' };
  }

  async sendReminders(patientIds: string[], message: string) {
    return { success: true, message: 'Reminders sent successfully' };
  }

  async loginPatient(phone: string, pin: string) {
    return { success: true, token: 'dummy-token', patient: this.dummyPatients[0] };
  }

  async registerPatient(name: string, phone: string, pin: string) {
    return { success: true, message: 'Patient registered successfully' };
  }

  async verifyPatient(phone: string, code: string) {
    return { success: true, message: 'Patient verified successfully' };
  }

  async registerStaff(name: string, email: string, password: string) {
    return { success: true, message: 'Staff registered successfully' };
  }

  async loginStaff(email: string, password: string) {
    return { success: true, token: 'dummy-staff-token', user: { name: 'Staff User', email } };
  }
}

export default new ApiClient();