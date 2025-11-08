class RealtimeService {
  private clients = new Set<any>();

  addClient(res: any) {
    this.clients.add(res);
    res.on('close', () => this.clients.delete(res));
  }

  broadcast(event: string, data: any) {
    const message = `data: ${JSON.stringify({ event, data })}\n\n`;
    this.clients.forEach(client => {
      try {
        client.write(message);
      } catch (error) {
        this.clients.delete(client);
      }
    });
  }

  notifyPatientUpdate(patient: any) {
    this.broadcast('patient-updated', patient);
  }

  notifyAppointmentCreated(appointment: any) {
    this.broadcast('appointment-created', appointment);
  }
}

export default new RealtimeService();