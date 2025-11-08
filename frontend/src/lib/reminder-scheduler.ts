import smsService from './sms-service';
import voiceService from './voice-service';

interface ScheduledReminder {
  id: string;
  patientId: string;
  type: 'appointment' | 'vaccination' | 'health_tip';
  scheduledTime: Date;
  sent: boolean;
}

class ReminderScheduler {
  private reminders: ScheduledReminder[] = [];

  scheduleAppointmentReminder(patientId: string, appointmentTime: Date): string {
    const reminderTime = new Date(appointmentTime.getTime() - 24 * 60 * 60 * 1000); // 24 hours before
    const id = `${patientId}-${Date.now()}`;
    
    this.reminders.push({
      id,
      patientId,
      type: 'appointment',
      scheduledTime: reminderTime,
      sent: false
    });
    
    return id;
  }

  scheduleVaccinationReminder(patientId: string, dueDate: Date): string {
    const reminderTime = new Date(dueDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days before
    const id = `${patientId}-vac-${Date.now()}`;
    
    this.reminders.push({
      id,
      patientId,
      type: 'vaccination',
      scheduledTime: reminderTime,
      sent: false
    });
    
    return id;
  }

  scheduleHealthTips(): void {
    // Schedule weekly health tips
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const id = `health-tip-${Date.now()}`;
    this.reminders.push({
      id,
      patientId: 'all',
      type: 'health_tip',
      scheduledTime: nextWeek,
      sent: false
    });
  }

  async processPendingReminders(): Promise<void> {
    const now = new Date();
    const pending = this.reminders.filter(r => !r.sent && r.scheduledTime <= now);
    
    for (const reminder of pending) {
      try {
        await this.sendReminder(reminder);
        reminder.sent = true;
      } catch (error) {
        console.error(`Failed to send reminder ${reminder.id}:`, error);
      }
    }
  }

  private async sendReminder(reminder: ScheduledReminder): Promise<void> {
    // Simulate sending reminder based on type
    console.log(`Sending ${reminder.type} reminder to patient ${reminder.patientId}`);
    
    switch (reminder.type) {
      case 'appointment':
        console.log('Appointment reminder sent');
        break;
      case 'vaccination':
        console.log('Vaccination reminder sent');
        break;
      case 'health_tip':
        console.log('Health tip sent to all patients');
        break;
    }
  }

  getPendingReminders(): ScheduledReminder[] {
    return this.reminders.filter(r => !r.sent);
  }
}

export default new ReminderScheduler();
export type { ScheduledReminder };