import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DoctorService, DoctorDashboardDto } from '../../services/doctor.service';
import { AuthService } from '../../services/auth.service';

interface Appointment {
  name: string;
  initial: string;
  reason: string;
  time: string;
  status: 'Scheduled' | 'Confirmed' | 'Cancelled';
}

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent implements OnInit {
  totalPatients = 0;
  activePatients = 0;
  todaysAppointments = 0;
  pendingVisits = 0;

  doctorInitials = 'SB';
  doctorName = 'Dr. Sarah Bennani';
  doctorSpecialty = 'Cardiology';
  showFilter: 'all' | 'scheduled' | 'confirmed' = 'all';

  appointments: Appointment[] = [];

  recentVisits = [
    { patient: 'Michael Chen', date: '2025-12-20', summary: 'Routine checkup - BP stable' },
    { patient: 'Aisha Ben', date: '2025-12-18', summary: 'Skin allergy follow-up' }
  ];

  constructor(private router: Router, private doctorService: DoctorService, private auth: AuthService) {}

  ngOnInit(): void {
    const username = this.auth.getUsername();
    if (!username) {
      // If username not known, redirect to login
      this.router.navigate(['/doctor-login']);
      return;
    }

    this.doctorService.getDashboard(username).subscribe({
      next: (dto: DoctorDashboardDto) => {
        this.totalPatients = dto.totalPatients;
        this.activePatients = dto.activePatients;
        this.todaysAppointments = dto.todaysAppointments;
        this.pendingVisits = dto.pendingVisits;
        this.appointments = dto.appointments as Appointment[];
      },
      error: (err) => {
        console.error('Failed to load dashboard', err);
      }
    });
  }

  refresh() { console.log('refresh dashboard'); }

  createAppointment() { this.router.navigate(['/doctor-page/appointments']); }

  filterDay(mode: string) { console.log('filterDay', mode); }

  confirmAppointment(appt: Appointment) { appt.status = 'Confirmed'; }

  cancelAppointment(appt: Appointment) { appt.status = 'Cancelled'; }

  viewVisit(v: any) { console.log('view visit', v); }
}
