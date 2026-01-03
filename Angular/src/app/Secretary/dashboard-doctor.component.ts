import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppointmentService, Appointment } from '../services/appointment.service';
import { PatientService, Patient } from '../services/patient.service';

@Component({
  selector: 'app-dashboard-doctor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-doctor.component.html',
  styleUrls: ['./dashboard-doctor.component.css']
})
export class DashboardDoctorComponent implements OnInit {
  todayStr = new Date().toLocaleDateString();
  selectedDate: string = new Date().toISOString().split('T')[0];

  totalPatients = 0;
  todayAppointments = 0;
  pendingVisits = 0;
  activePatients = 0;
  appointments: Appointment[] = [];
  patients: Patient[] = [];

  constructor(
    private apptService: AppointmentService,
    private patientService: PatientService
  ) {
    this.apptService.appointments$.subscribe(list => {
      this.recomputeStats(list, this.selectedDate);
    });
  }

  ngOnInit() {
    this.patients = this.patientService.getAllPatients();
    const all = this.apptService.getAppointments();
    this.recomputeStats(all, this.selectedDate);
  }

  onDateChange(newDate: string) {
    this.selectedDate = newDate;
    const all = this.apptService.getAppointments();
    this.recomputeStats(all, newDate);
    this.todayStr = new Date(newDate).toLocaleDateString();
  }

  getPatientId(patientName: string): string {
    const patient = this.patients.find(p => p.fullName === patientName);
    return patient ? patient.id : '';
  }

  getPatientAge(patientName: string): number {
    const patient = this.patients.find(p => p.fullName === patientName);
    return patient ? patient.age : 0;
  }

  private recomputeStats(allAppointments: Appointment[], date: string) {
    const dayAppts = allAppointments.filter(a => a.date === date);
    this.appointments = dayAppts;

    const uniquePatients = new Set(dayAppts.map(a => a.patientName));
    this.totalPatients = uniquePatients.size;

    this.todayAppointments = dayAppts.length;
    this.pendingVisits = dayAppts.filter(a => a.status === 'Pending').length;
    this.activePatients = this.patients.length;
  }
}
