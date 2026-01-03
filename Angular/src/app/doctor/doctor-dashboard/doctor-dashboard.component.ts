import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Notification {
  id: number;
  message: string;
  read: boolean;
}

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent {

  notificationsOpen = false;

  notifications: Notification[] = [
    { id: 1, message: 'New appointment scheduled', read: false },
    { id: 2, message: 'Patient updated profile', read: false },
    { id: 3, message: 'Visit completed', read: false }
  ];

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  toggleNotifications() {
    this.notificationsOpen = !this.notificationsOpen;
  }

  markAsRead(notification: Notification) {
    notification.read = true;
  }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.notifications')) {
      this.notificationsOpen = false;
    }
  }

  logout() {
    localStorage.clear();
    location.href = '/';
  }
}
