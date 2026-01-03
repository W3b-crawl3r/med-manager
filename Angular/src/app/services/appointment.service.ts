import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Appointment {
  date: string; // YYYY-MM-DD
  time: string;
  patientName: string;
  type: string;
  status: 'Confirmed' | 'Scheduled' | 'Pending';
}

const today = new Date().toISOString().split('T')[0];

const initialData: Appointment[] = [
  { date: today, time: '09:00', patientName: 'Michael Chen', type: 'General Checkup', status: 'Confirmed' },
  { date: today, time: '10:30', patientName: 'Emma Rodriguez', type: 'Follow-up', status: 'Scheduled' },
  { date: today, time: '14:00', patientName: 'David Thompson', type: 'Consultation', status: 'Pending' },
];

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private appointmentsSubject = new BehaviorSubject<Appointment[]>(initialData);
  appointments$ = this.appointmentsSubject.asObservable();

  getAppointments(): Appointment[] {
    return this.appointmentsSubject.value;
  }

  private timeToMinutes(t: string) {
    const [hh, mm] = t.split(':').map(Number);
    return hh * 60 + mm;
  }

  addAppointment(appt: Appointment): { success: boolean; conflict?: Appointment } {
    const current = this.appointmentsSubject.value;
    const sameDate = current.filter(a => a.date === appt.date);

    for (const a of sameDate) {
      const diff = Math.abs(this.timeToMinutes(a.time) - this.timeToMinutes(appt.time));
      if (diff < 15) {
        return { success: false, conflict: a };
      }
    }

    this.appointmentsSubject.next([...current, appt]);
    return { success: true };
  }
}
