import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Patient {
  id: number;
  name: string;
}

interface Appointment {
  patientId: number;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status?: 'Scheduled' | 'Confirmed' | 'Cancelled';
}

@Component({
  selector: 'app-doctor-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-appointment.component.html',
  styleUrls: ['./doctor-appointment.component.css']
})
export class DoctorAppointmentComponent {

  showDialog = false;
  editIndex: number | null = null;

  patients: Patient[] = [
    { id: 1, name: 'Michael Chen' },
    { id: 2, name: 'Emma Rodriguez' },
    { id: 3, name: 'David Thompson' }
  ];

  appointments: Appointment[] = [
    { patientId: 1, patientName: 'Michael Chen', date: '2025-12-20', time: '09:00', type: 'Checkup', status: 'Scheduled' },
    { patientId: 2, patientName: 'Emma Rodriguez', date: '2025-12-20', time: '10:30', type: 'Follow-up', status: 'Confirmed' }
  ];

  form = {
    patientId: '',
    date: '',
    time: '',
    type: ''
  };

  // weekday quick-pick
  weekdayLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  // order maps labels index to JS getDay() index: Mon=1 ... Sun=0
  weekdayOrder = [1,2,3,4,5,6,0];
  selectedWeekday: number | null = null;
  // available times per weekday and filtered times shown in UI
  availableTimesByWeekday: Record<number, string[]> = {};
  filteredTimes: string[] = [];

  // ===== DIALOG =====
  openDialog() {
    this.resetForm();
    this.editIndex = null;
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
  }

  // ===== ADD / EDIT =====
  submit() {
    if (!this.form.patientId || !this.form.date || !this.form.time) {
      alert('All required fields must be filled');
      return;
    }

    if (!this.isFutureDate(this.form.date, this.form.time)) {
      alert('Appointment must be in the future');
      return;
    }

    const patient = this.patients.find(p => p.id === Number(this.form.patientId));
    if (!patient) return;

    const appointment: Appointment = {
      patientId: patient.id,
      patientName: patient.name,
      date: this.form.date,
      time: this.form.time,
      type: this.form.type || 'General'
    };

    if (this.editIndex !== null) {
      this.appointments[this.editIndex] = appointment;
    } else {
      this.appointments.push({ ...appointment, status: 'Scheduled' });
    }

    this.saveAppointments();
    this.closeDialog();
  }

  confirmAppointment(index: number) {
    this.appointments[index].status = 'Confirmed';
    this.saveAppointments();
  }

  cancelAppointment(index: number) {
    if (confirm('Cancel this appointment?')) {
      this.appointments[index].status = 'Cancelled';
      this.saveAppointments();
    }
  }

  // ===== EDIT =====
  editAppointment(index: number) {
    const a = this.appointments[index];
    this.form = {
      patientId: String(a.patientId),
      date: a.date,
      time: a.time,
      type: a.type
    };
    this.editIndex = index;
    this.showDialog = true;
  }

  // ===== DELETE =====
  deleteAppointment(index: number) {
    if (confirm('Delete this appointment?')) {
      this.appointments.splice(index, 1);
      this.saveAppointments();
    }
  }

  // ===== HELPERS =====
  resetForm() {
    this.form = { patientId: '', date: '', time: '', type: '' };
    this.selectedWeekday = null;
  }

  // persist appointments to localStorage
  constructor() {
    try {
      const raw = localStorage.getItem('doctorAppointments');
      if (raw) this.appointments = JSON.parse(raw);
    } catch (e) {
      // ignore parse errors
    }
    // initialize availability
    this.initAvailableTimes();
  }

  saveAppointments() {
    try {
      localStorage.setItem('doctorAppointments', JSON.stringify(this.appointments));
    } catch (e) {
      // ignore storage errors
    }
  }

  isFutureDate(date: string, time: string): boolean {
    const selected = new Date(`${date}T${time}`);
    return selected.getTime() > new Date().getTime();
  }

  get today(): string {
    return new Date().toISOString().split('T')[0];
  }

  pickWeekday(jsWeekday: number) {
    this.selectedWeekday = jsWeekday;
    // ensure available times initialized
    if (!this.availableTimesByWeekday || Object.keys(this.availableTimesByWeekday).length === 0) {
      this.initAvailableTimes();
    }

    const slots = this.availableTimesByWeekday[jsWeekday] || [];
    const today = new Date();
    const todayIndex = today.getDay();

    if (jsWeekday === todayIndex) {
      // if there is a slot later than now, choose today; otherwise pick next occurrence
      const nowMinutes = today.getHours() * 60 + today.getMinutes();
      const futureSlot = slots.find(s => {
        const [h, m] = s.split(':').map(Number);
        return (h * 60 + m) > nowMinutes;
      });
      if (futureSlot) {
        this.form.date = today.toISOString().split('T')[0];
      } else {
        this.form.date = this.nextDateForWeekday(jsWeekday);
      }
    } else {
      this.form.date = this.nextDateForWeekday(jsWeekday);
    }

    this.filteredTimes = slots;
    if (this.filteredTimes.length && !this.filteredTimes.includes(this.form.time)) {
      this.form.time = this.filteredTimes[0];
    }
  }

  selectTime(t: string) {
    this.form.time = t;
  }

  // Initialize sample availability per weekday (9:00-12:00, 14:00-17:00 weekdays)
  initAvailableTimes() {
    const make = (startHour: number, endHour: number, stepMins = 30) => {
      const arr: string[] = [];
      for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += stepMins) {
          const hh = String(h).padStart(2, '0');
          const mm = String(m).padStart(2, '0');
          arr.push(`${hh}:${mm}`);
        }
      }
      return arr;
    };

    const weekdaySlots = make(9,12).concat(make(14,17));
    const weekendSlots = make(10,13);

    // JS getDay(): 0=Sun,1=Mon,...6=Sat
    this.availableTimesByWeekday = {
      1: weekdaySlots,
      2: weekdaySlots,
      3: weekdaySlots,
      4: weekdaySlots,
      5: weekdaySlots,
      6: weekendSlots,
      0: weekendSlots
    };
  }

  nextDateForWeekday(targetWeekday: number): string {
    const today = new Date();
    const todayIndex = today.getDay();
    let daysAhead = (targetWeekday - todayIndex + 7) % 7;
    if (daysAhead === 0) {
      // pick the next occurrence (one week ahead) to avoid same-day confusion
      daysAhead = 7;
    }
    const next = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysAhead);
    return next.toISOString().split('T')[0];
  }
}