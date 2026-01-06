import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  imports: [CommonModule, RouterModule],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent {

  totalPatients = 5;
  activePatients = 5;
  todaysAppointments = 3;
  pendingVisits = 2;

  appointments: Appointment[] = [
    {
      name: 'Michael Chen',
      initial: 'M',
      reason: 'General Checkup',
      time: '09:00',
      status: 'Confirmed'
    },
    {
      name: 'Emma Rodriguez',
      initial: 'E',
      reason: 'Follow-up',
      time: '10:30',
      status: 'Scheduled'
    }
  ];

  confirmAppointment(appt: Appointment) {
    appt.status = 'Confirmed';
  }
}
