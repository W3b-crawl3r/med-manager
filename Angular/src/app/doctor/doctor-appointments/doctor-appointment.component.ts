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

  appointments: Appointment[] = [];

  form = {
    patientId: '',
    date: '',
    time: '',
    type: ''
  };

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
      this.appointments.push(appointment);
    }

    this.closeDialog();
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
    }
  }

  // ===== HELPERS =====
  resetForm() {
    this.form = { patientId: '', date: '', time: '', type: '' };
  }

  isFutureDate(date: string, time: string): boolean {
    const selected = new Date(`${date}T${time}`);
    return selected.getTime() > new Date().getTime();
  }

  get today(): string {
    return new Date().toISOString().split('T')[0];
  }
}