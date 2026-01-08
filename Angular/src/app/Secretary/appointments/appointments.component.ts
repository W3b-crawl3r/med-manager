import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppointmentService, Appointment } from '../../services/appointment.service';
import { PatientService, Patient } from '../../services/patient.service';

@Component({
  standalone: true,
  selector: 'app-appointments',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  selectedDate: string = new Date().toISOString().split('T')[0];

  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  
  patients: Patient[] = [];

  newPatientId = '';
  newTime = '09:00';
  newType = '';
  newStatus: Appointment['status'] = 'Scheduled';
  errorMessage = '';
  showForm = false;

  constructor(
    private apptService: AppointmentService,
    private patientService: PatientService
  ) {
    this.apptService.appointments$.subscribe(list => {
      this.appointments = list;
      this.filterAppointments();
    });
  }

  ngOnInit() {
    this.patients = this.patientService.getAllPatients();
  }

  filterAppointments() {
    this.filteredAppointments = this.appointments.filter(
      a => a.date === this.selectedDate
    );
  }

  getPatientId(patientName: string): string {
    const patient = this.patients.find(p => p.fullName === patientName);
    return patient ? patient.id : '';
  }

  getPatientAge(patientName: string): number {
    const patient = this.patients.find(p => p.fullName === patientName);
    return patient ? patient.age : 0;
  }

  add() {
    if (!this.newPatientId || !this.newTime) {
      this.errorMessage = 'Please select a patient and time';
      return;
    }

    const patient = this.patients.find(p => p.id === this.newPatientId);
    if (!patient) return;

    const appt: Appointment = {
      date: this.selectedDate,
      time: this.newTime,
      patientName: patient.fullName,
      type: this.newType || 'Consultation',
      status: this.newStatus
    };

    const result = this.apptService.addAppointment(appt);
    if (!result.success) {
      this.errorMessage = `Conflict: existing appointment at ${result.conflict?.time} (need ≥15 min)`;
      return;
    }

    this.errorMessage = '';
    this.newPatientId = '';
    this.newTime = '09:00';
    this.newType = '';
    this.newStatus = 'Scheduled';
    this.showForm = false;
  }
  logout() {
    localStorage.clear();
    location.href = '/';
  }
}
