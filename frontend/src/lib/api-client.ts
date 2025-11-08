class ApiClient {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  async get(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const result = await response.json();
    return result.success ? result.data : result;
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || `API Error: ${response.status}`);
    return result.success ? result.data : result;
  }

  async put(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const result = await response.json();
    return result.success ? result.data : result;
  }

  async getPatients() {
    return this.get('/api/patient/list');
  }

  async updatePatient(id: string, data: any) {
    return this.put(`/api/patient/${id}`, data);
  }

  async sendReminders(patientIds: string[], message: string) {
    return this.post('/api/patient/remind', { patient_ids: patientIds, message });
  }

  async loginPatient(phone: string, pin: string) {
    return this.post('/api/patient/login', { phone, pin });
  }

  async registerPatient(name: string, phone: string, pin: string) {
    return this.post('/api/patient/register', { name, phone, pin });
  }

  async verifyPatient(phone: string, code: string) {
    return this.post('/api/patient/verify', { phone, code });
  }

  async registerStaff(name: string, email: string, password: string) {
    return this.post('/api/auth/register', { name, email, password });
  }

  async loginStaff(email: string, password: string) {
    return this.post('/api/auth/login', { email, password });
  }
}

export default new ApiClient();