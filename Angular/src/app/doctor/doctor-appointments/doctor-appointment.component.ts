import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService, AppointmentDto } from '../../services/doctor.service';
import { AuthService } from '../../services/auth.service';

interface PatientOption {
  id: number;
  name: string;
}

type Appointment = AppointmentDto;

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

  patients: PatientOption[] = [];

  appointments: Appointment[] = [];

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
    alert('Creating appointments from the UI is not implemented yet.');
  }

  closeDialog() {
    this.showDialog = false;
  }

  // ===== ADD / EDIT =====
  submit() {
    alert('Save is not implemented yet.');
  }

  confirmAppointment(index: number) {
    alert('Confirm is not implemented yet.');
  }

  cancelAppointment(index: number) {
    alert('Cancel is not implemented yet.');
  }

  // ===== EDIT =====
  editAppointment(index: number) {
    alert('Edit is not implemented yet.');
  }

  // ===== DELETE =====
  deleteAppointment(index: number) {
    alert('Delete is not implemented yet.');
  }

  // ===== HELPERS =====
  resetForm() {
    this.form = { patientId: '', date: '', time: '', type: '' };
    this.selectedWeekday = null;
  }

  constructor(private doctorService: DoctorService, private auth: AuthService) {
    this.initAvailableTimes();
  }

  ngOnInit(): void {
    const username = this.auth.getUsername();
    if (!username) return;

    this.doctorService.getPatients(username).subscribe({
      next: (ps) => {
        this.patients = ps.map(p => ({ id: p.id, name: p.username }));
      },
      error: (err) => console.error('Failed to load patients', err)
    });

    this.doctorService.getAppointments(username).subscribe({
      next: (apps) => {
        this.appointments = apps.map(a => ({
          ...a,
          date: a.date,
          status: (a.status as any) || 'Scheduled'
        }));
      },
      error: (err) => console.error('Failed to load appointments', err)
    });
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