import socketService from './socket';
import { store } from '../store';
import { updatePatientFromSync, setPatientActive } from '../store/slices/patientSlice';
import { addAlert } from '../store/slices/alertSlice';

class SyncService {
  private patientId: string | null = null;
  private userType: 'staff' | 'patient' | null = null;

  initialize(userType: 'staff' | 'patient', userId?: string) {
    this.userType = userType;
    if (userType === 'patient') {
      this.patientId = userId || null;
    }

    socketService.connect();
    
    if (userType === 'staff') {
      socketService.joinRoom('staff-room');
      this.setupStaffListeners();
    } else if (userType === 'patient' && userId) {
      socketService.joinRoom(`patient-${userId}`);
      this.setupPatientListeners();
      this.notifyPatientActive(userId);
    }
  }

  private setupStaffListeners() {
    socketService.onPatientDataUpdated((data) => {
      const dispatch = store.dispatch;
      
      switch (data.type) {
        case 'patient_active':
          dispatch(setPatientActive({ id: data.patientId, isActive: true }));
          dispatch(addAlert({
            message: `${data.patientName} is now active`,
            type: 'info'
          }));
          break;
        case 'patient_inactive':
          dispatch(setPatientActive({ id: data.patientId, isActive: false }));
          break;
        case 'patient_data_changed':
          dispatch(updatePatientFromSync(data.patientData));
          break;
      }
    });
  }

  private setupPatientListeners() {
    socketService.onStaffDataUpdated((data) => {
      const dispatch = store.dispatch;
      
      switch (data.type) {
        case 'risk_update':
          dispatch(addAlert({
            message: data.message,
            type: 'info'
          }));
          break;
        case 'appointment_scheduled':
          dispatch(addAlert({
            message: `New appointment scheduled: ${data.appointmentDate}`,
            type: 'success'
          }));
          break;
        case 'medication_updated':
          dispatch(addAlert({
            message: 'Your medication has been updated',
            type: 'info'
          }));
          break;
      }
    });
  }

  notifyPatientActive(patientId: string) {
    if (this.userType === 'patient') {
      socketService.emitPatientUpdate({
        type: 'patient_active',
        patientId,
        patientName: store.getState().auth.user?.name || 'Patient'
      });
    }
  }

  notifyPatientInactive(patientId: string) {
    if (this.userType === 'patient') {
      socketService.emitPatientUpdate({
        type: 'patient_inactive',
        patientId
      });
    }
  }

  notifyStaffUpdate(type: string, data: any) {
    if (this.userType === 'staff') {
      socketService.emitStaffUpdate({
        type,
        ...data
      });
    }
  }

  disconnect() {
    if (this.patientId && this.userType === 'patient') {
      this.notifyPatientInactive(this.patientId);
    }
    socketService.disconnect();
    this.patientId = null;
    this.userType = null;
  }
}

export default new SyncService();