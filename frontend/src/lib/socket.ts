import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private connected = false;

  connect() {
    if (this.socket?.connected) return;

    this.socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      this.connected = true;
      console.log('🔄 Real-time sync connected');
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      console.log('❌ Real-time sync disconnected');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  joinRoom(room: string) {
    if (this.socket) {
      this.socket.emit('join-room', room);
    }
  }

  // Patient updates that staff should see
  emitPatientUpdate(data: any) {
    if (this.socket) {
      this.socket.emit('patient-update', {
        ...data,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Staff updates that patients should see
  emitStaffUpdate(data: any) {
    if (this.socket) {
      this.socket.emit('staff-update', {
        ...data,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Listen for patient data updates (for staff)
  onPatientDataUpdated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('patient-data-updated', callback);
    }
  }

  // Listen for staff data updates (for patients)
  onStaffDataUpdated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('staff-data-updated', callback);
    }
  }

  isConnected() {
    return this.connected;
  }

  getSocket() {
    return this.socket;
  }
}

export default new SocketService();