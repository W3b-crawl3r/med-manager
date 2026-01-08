import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface SystemAlert {
  id: number;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: Date;
}

interface DoctorStats {
  name: string;
  specialty: string;
  patients: number;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Dashboard Stats
  totalDoctors: number = 4;
  activeDoctors: number = 3;
  totalPatients: number = 388;
  systemAlerts: number = 0;

  // System Overview
  systemHealth: number = 98;
  storageUsage: number = 65;
  activeSessions: number = 12;

  // Recent Activity
  recentActivities = [
    {
      id: 1,
      user: 'Admin User',
      action: 'Logged in',
      time: '2 minutes ago',
      icon: 'fas fa-sign-in-alt'
    },
    {
      id: 2,
      user: 'Dr. Sarah Johnson',
      action: 'Updated patient records',
      time: '15 minutes ago',
      icon: 'fas fa-file-medical'
    },
    {
      id: 3,
      user: 'System',
      action: 'Database backup completed',
      time: '1 hour ago',
      icon: 'fas fa-database'
    },
    {
      id: 4,
      user: 'Dr. Michael Lee',
      action: 'Added new patient',
      time: '2 hours ago',
      icon: 'fas fa-user-plus'
    }
  ];

  // Doctor Statistics
  doctorStats: DoctorStats[] = [
    { name: 'Dr. Sarah Johnson', specialty: 'General Practice', patients: 156, status: 'active' },
    { name: 'Dr. Michael Lee', specialty: 'Cardiology', patients: 98, status: 'active' },
    { name: 'Dr. Emily Parker', specialty: 'Pediatrics', patients: 134, status: 'active' },
    { name: 'Dr. Craig Doctor', specialty: 'Neurology', patients: 0, status: 'inactive' }
  ];

  // System Alerts
  systemAlertsList: SystemAlert[] = [
    // Currently no alerts
  ];

  // Quick Stats
  quickStats = {
    appointmentsToday: 24,
    newPatientsWeek: 42,
    prescriptionsPending: 8,
    revenueMonth: '€12,450'
  };

  constructor() { }

  ngOnInit(): void {
    // Simulate data loading
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // In a real application, this would be an API call
    console.log('Loading dashboard data...');
  }

  refreshDashboard(): void {
    console.log('Refreshing dashboard...');
    // Simulate refresh
    this.systemHealth = 98 + Math.floor(Math.random() * 2);
    this.activeSessions = 12 + Math.floor(Math.random() * 3);
  }

  getSystemHealthColor(): string {
    if (this.systemHealth >= 90) return 'success';
    if (this.systemHealth >= 70) return 'warning';
    return 'danger';
  }

  getStorageUsageColor(): string {
    if (this.storageUsage < 70) return 'success';
    if (this.storageUsage < 90) return 'warning';
    return 'danger';
  }

  calculateDoctorStatus(): { active: number, inactive: number } {
    const active = this.doctorStats.filter(d => d.status === 'active').length;
    const inactive = this.doctorStats.filter(d => d.status === 'inactive').length;
    return { active, inactive };
  }
}