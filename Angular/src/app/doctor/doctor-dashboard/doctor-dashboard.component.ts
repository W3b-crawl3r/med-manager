import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
export class DoctorDashboardComponent {
  totalPatients = 24;
  activePatients = 18;
  todaysAppointments = 6;
  pendingVisits = 4;

  doctorInitials = 'SB';
  doctorName = 'Dr. Sarah Bennani';
  doctorSpecialty = 'Cardiology';
  showFilter: 'all' | 'scheduled' | 'confirmed' = 'all';

  appointments: Appointment[] = [
    { name: 'Michael Chen', initial: 'M', reason: 'General Checkup', time: '09:00', status: 'Confirmed' },
    { name: 'Emma Rodriguez', initial: 'E', reason: 'Follow-up', time: '10:30', status: 'Scheduled' },
    { name: 'David Thompson', initial: 'D', reason: 'Consultation', time: '11:15', status: 'Scheduled' }
  ];

  recentVisits = [
    { patient: 'Michael Chen', date: '2025-12-20', summary: 'Routine checkup - BP stable' },
    { patient: 'Aisha Ben', date: '2025-12-18', summary: 'Skin allergy follow-up' }
  ];

  constructor(private router: Router) {}

  refresh() { console.log('refresh dashboard'); }

  createAppointment() { this.router.navigate(['/doctor-page/appointments']); }

  filterDay(mode: string) { console.log('filterDay', mode); }

  confirmAppointment(appt: Appointment) { appt.status = 'Confirmed'; }

  cancelAppointment(appt: Appointment) { appt.status = 'Cancelled'; }

  viewVisit(v: any) { console.log('view visit', v); }
}
