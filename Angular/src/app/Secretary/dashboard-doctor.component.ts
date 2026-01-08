import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SecretaryService, SecretaryAppointment } from '../services/secretary.service';
import { AuthService } from '../services/auth.service';

interface Patient {
  id: number;
  username: string;
  fullName?: string;
  age?: number;
}

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
  appointments: SecretaryAppointment[] = [];
  patients: Patient[] = [];

  constructor(
    private secretaryService: SecretaryService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const username = this.auth.getUsername();
    if (!username) {
      return;
    }

    // Load patients
    this.secretaryService.getPatients(username).subscribe({
      next: (ps) => {
        this.patients = ps.map(p => ({ 
          id: p.id, 
          username: p.username,
          fullName: p.username,
          age: 35 // placeholder
        }));
      },
      error: (err) => console.error('Failed to load patients', err)
    });

    // Load dashboard data for today
    this.loadDashboard();
  }

  onDateChange(newDate: string) {
    this.selectedDate = newDate;
    this.todayStr = new Date(newDate).toLocaleDateString();
    this.loadDashboard();
  }

  private loadDashboard() {
    const username = this.auth.getUsername();
    if (!username) return;

    this.secretaryService.getDashboard(username, this.selectedDate).subscribe({
      next: (dto) => {
        this.totalPatients = dto.totalPatients;
        this.todayAppointments = dto.appointmentsOnDate;
        this.pendingVisits = dto.pendingVisits;
        this.activePatients = dto.activePatients;
        this.appointments = dto.appointments;
      },
      error: (err) => console.error('Failed to load dashboard', err)
    });
  }

  getPatientId(patientName: string): string {
    const patient = this.patients.find(p => p.fullName === patientName);
    return patient ? String(patient.id) : '';
  }

  getPatientAge(patientName: string): number {
    const patient = this.patients.find(p => p.fullName === patientName);
    return patient ? (patient.age || 0) : 0;
  }

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
