import { Component, HostListener, Inject, Renderer2 } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Notification {
  id: number;
  message: string;
  read: boolean;
}

@Component({
  selector: 'app-doctor-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './doctor-layout.component.html',
  styleUrls: ['./doctor-layout.component.css']
})
export class DoctorLayoutComponent {

  isDark = false;
  notificationsOpen = false;

  notifications: Notification[] = [
    { id: 1, message: 'New appointment scheduled', read: false },
    { id: 2, message: 'Patient updated profile', read: false },
    { id: 3, message: 'Visit completed', read: false }
  ];

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {
    const saved = localStorage.getItem('theme') || 'light';
    this.isDark = saved === 'dark';
    this.applyTheme(saved);
  }

  // ----- Simple chat state (doctor <-> secretary demo) -----
  chatOpen = false;
  chatMessages: Array<{ from: 'doctor' | 'secretary'; text: string; time: string }> = [
    { from: 'secretary', text: 'New appointment for 10:30 has been scheduled.', time: '09:12' },
    { from: 'doctor', text: 'Thanks, I will review the patient files first.', time: '09:15' }
  ];
  chatDraft = '';

  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }

  sendChat() {
    const text = this.chatDraft.trim();
    if (!text) return;
    this.chatMessages.push({ from: 'doctor', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    this.chatDraft = '';
    // simulate secretary reply (demo)
    setTimeout(() => {
      this.chatMessages.push({ from: 'secretary', text: 'Acknowledged — will prepare the patient.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    }, 1200);
  }

  get logoSrc() {
    // sidebar uses a dark background — use white logo to ensure visibility
    return 'assets/medMan-white.png';
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  toggleNotifications() {
    this.notificationsOpen = !this.notificationsOpen;
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    const newTheme = this.isDark ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    this.applyTheme(newTheme);
  }

  getThemeIcon(): string {
    return this.isDark ? 'light_mode' : 'dark_mode';
  }

  private applyTheme(theme: string) {
    try {
      this.renderer.setAttribute(this.document.documentElement, 'data-theme', theme);
      this.renderer.setAttribute(this.document.body, 'data-theme', theme);
    } catch (e) {
      this.document.documentElement.setAttribute('data-theme', theme);
      this.document.body.setAttribute('data-theme', theme);
    }
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
