export const validatePatient = (data: any) => {
  const errors: string[] = [];
  
  if (!data.name || data.name.length < 2) errors.push('Name must be at least 2 characters');
  if (!data.phone || !/^\+234\d{10}$/.test(data.phone)) errors.push('Invalid phone number format');
  if (!data.state) errors.push('State is required');
  if (data.missedAppointments < 0) errors.push('Missed appointments cannot be negative');
  
  return { isValid: errors.length === 0, errors };
};

export const validateAppointment = (data: any) => {
  const errors: string[] = [];
  
  if (!data.patientId) errors.push('Patient ID is required');
  if (!data.date || new Date(data.date) < new Date()) errors.push('Date must be in the future');
  if (!data.time) errors.push('Time is required');
  
  return { isValid: errors.length === 0, errors };
};

export const sanitizeInput = (input: string) => {
  return input.trim().replace(/[<>]/g, '');
};