import { Component, signal, WritableSignal, HostListener, OnInit, Inject, Renderer2, HostBinding } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  protected readonly title = signal('Med Manager');

  // ===== Theme with HostBinding =====
  @HostBinding('attr.data-theme') theme = 'light';
  isDark = false;

  // ===== Live Data =====
  private messages: any[] = [];
  unreadMessages = signal(0);
  showChat = false;

  // Steps data
  steps = [
    { icon: 'search', title: '1. Choose a Doctor', description: 'Browse verified healthcare professionals with detailed profiles and reviews' },
    { icon: 'event', title: '2. Book Appointment', description: 'Select convenient date and time with real-time availability' },
    { icon: 'medical_services', title: '3. Visit & Consult', description: 'Get professional consultation with secure video or in-person visits' },
    { icon: 'folder', title: '4. Secure Records', description: 'All medical records stored securely with HIPAA compliance' }
  ];

  // Portals data
  portals = [
    {
      title: 'Doctor Portal',
      icon: 'medical_services',
      description: 'Full medical access with comprehensive tools',
      route: '/login/doctor',
      features: [
        { icon: 'check', text: 'Patient medical history', restricted: false },
        { icon: 'check', text: 'Visit records & prescriptions', restricted: false },
        { icon: 'check', text: 'Appointment management', restricted: false }
      ]
    },
    {
      title: 'Secretary Portal',
      icon: 'assignment',
      description: 'Administrative access for office management',
      route: '/login/secretary',
      features: [
        { icon: 'check', text: 'Appointment scheduling', restricted: false },
        { icon: 'check', text: 'Patient basic information', restricted: false },
        { icon: 'close', text: 'No medical history access', restricted: true }
      ]
    },
    {
      title: 'Patient Portal',
      icon: 'person',
      description: 'Personal health management dashboard',
      route: '/login/patient',
      features: [
        { icon: 'check', text: 'Personal profile & records', restricted: false },
        { icon: 'check', text: 'Book appointments online', restricted: false },
        { icon: 'check', text: 'Visit summaries & prescriptions', restricted: false }
      ]
    },
    {
      title: 'Super Admin',
      icon: 'admin_panel_settings',
      description: 'Complete system management & monitoring',
      route: '/login/admin',
      features: [
        { icon: 'check', text: 'Doctor validation & approval', restricted: false },
        { icon: 'check', text: 'Role-based permissions', restricted: false },
        { icon: 'check', text: 'System monitoring & analytics', restricted: false }
      ]
    }
  ];

  // Security features
  securityFeatures = [
    { icon: 'security', title: 'Medical Data Privacy', description: 'HIPAA compliant standards with end-to-end encryption' },
    { icon: 'lock', title: 'Secure Access', description: 'Multi-factor authentication and role-based access control' },
    { icon: 'groups', title: 'Role-Based Permissions', description: 'Granular control over data access and operations' },
    { icon: 'article', title: 'Audit & Logs', description: 'Complete activity tracking with tamper-proof logging' }
  ];

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // Check for saved theme preference on init
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.isDark = savedTheme === 'dark';
    this.theme = savedTheme;
    this.updateTheme(savedTheme);
    
    // Simulate live chat messages
    this.simulateLiveChat();
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    const newTheme = this.isDark ? 'dark' : 'light';
    
    // Update HostBinding
    this.theme = newTheme;
    
    // Update theme in DOM
    this.updateTheme(newTheme);
    
    // Save preference
    localStorage.setItem('theme', newTheme);
  }

  private updateTheme(theme: string) {
    // Direct DOM manipulation for reliable theme switching
    this.document.body.setAttribute('data-theme', theme);
    this.document.documentElement.setAttribute('data-theme', theme);
  }

  getThemeIcon(): string {
    return this.isDark ? 'light_mode' : 'dark_mode';
  }

  // ===== Account Actions & Menus =====
  registerMenuOpen: WritableSignal<boolean> = signal(false);

  toggleRegisterMenu() {
    this.registerMenuOpen.update(v => !v);
  }

  onRegisterRoleClick(role: string) {
    const routes: Record<string, string> = {
      doctor: '/doctor-inscription',
      secretaire: '/secretary-inscription',
      patient: '/patient-inscription'
    };

    if (routes[role]) {
      this.registerMenuOpen.set(false);
      this.router.navigate([routes[role]]);
      return;
    }
  }

  // ===== Route Helpers =====
  isDoctorRoute(): boolean {
    const url = this.router.url;
    return url.startsWith('/doctor-inscription') || 
           url.startsWith('/doctor-login') || 
           url.startsWith('/doctor-page') ||
           url === '/doctor-dashboard';
  }

  isSecretaryRoute(): boolean {
    const url = this.router.url;
    return url.startsWith('/secretary-inscription') || 
           url.startsWith('/secretary-login') ||
           url === '/secretary-dashboard';
  }

  isPatientRoute(): boolean {
    const url = this.router.url;
    return url.startsWith('/patient-inscription') || 
           url.startsWith('/patient-login') ||
           url === '/patient-dashboard';
  }

  isAuthRoute(): boolean {
    return this.isDoctorRoute() || this.isSecretaryRoute() || this.isPatientRoute();
  }

  // ===== Click Outside =====
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const registerMenu = this.document.querySelector('.register-menu');
    const registerButton = this.document.querySelector('.primary-btn');
    
    // Close register menu if clicked outside
    if (registerMenu && registerButton && 
        !registerMenu.contains(target) && 
        !registerButton.contains(target)) {
      this.registerMenuOpen.set(false);
    }
  }

  // ===== Live Chat =====
  toggleChat() {
    this.showChat = !this.showChat;
    if (this.showChat) {
      this.unreadMessages.set(0);
    }
  }

  hasUnreadMessages(): boolean {
    return this.unreadMessages() > 0;
  }

  private simulateLiveChat() {
    // Simulate incoming messages
    setInterval(() => {
      if (!this.showChat && Math.random() > 0.7) {
        this.messages.push({
          id: Date.now(),
          text: 'Need help with booking?',
          time: new Date(),
          unread: true
        });
        this.unreadMessages.update(count => count + 1);
      }
    }, 30000);
  }

  // ===== Doctor Filtering =====
  searchTerm = '';
  selectedSpecialty = 'all';
  selectedCity = 'all';

  // Enhanced doctors data with live features
  doctors = [
    { 
      id: 1, 
      name: 'Dr. Sarah Bennani', 
      specialty: 'Cardiologist', 
      clinic: 'Heart Care Clinic', 
      location: 'Casablanca', 
      experience: 12, 
      rating: 4.8, 
      nextAvailable: 'Tomorrow 10 AM',
      availability: ['Mon', 'Wed', 'Fri', 'Sat'],
      online: true,
      image: 'assets/doctors/doc1.jpg' 
    },
    { 
      id: 2, 
      name: 'Dr. Youssef Amrani', 
      specialty: 'Dermatologist', 
      clinic: 'Skin Center', 
      location: 'Rabat', 
      experience: 9, 
      rating: 4.6, 
      nextAvailable: 'Today 3 PM',
      availability: ['Tue', 'Thu', 'Sat'],
      online: false,
      image: 'assets/doctors/doc2.jpg' 
    },
    { 
      id: 3, 
      name: 'Dr. Amina El Fassi', 
      specialty: 'Pediatrician', 
      clinic: 'Children\'s Health Center', 
      location: 'Marrakech', 
      experience: 15, 
      rating: 4.9, 
      nextAvailable: 'Monday 9 AM',
      availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      online: true,
      image: 'assets/doctors/doc3.jpg' 
    },
    { 
      id: 4, 
      name: 'Dr. Karim Bouzidi', 
      specialty: 'Orthopedic Surgeon', 
      clinic: 'Bone & Joint Clinic', 
      location: 'Casablanca', 
      experience: 18, 
      rating: 4.7, 
      nextAvailable: 'Wednesday 2 PM',
      availability: ['Wed', 'Thu', 'Sat'],
      online: true,
      image: 'assets/doctors/doc4.jpg' 
    },
    { 
      id: 5, 
      name: 'Dr. Fatima Zahra Alaoui', 
      specialty: 'Neurologist', 
      clinic: 'Neuro Care Center', 
      location: 'Rabat', 
      experience: 11, 
      rating: 4.8, 
      nextAvailable: 'Friday 11 AM',
      availability: ['Mon', 'Fri'],
      online: false,
      image: 'assets/doctors/doc5.jpg' 
    },
    { 
      id: 6, 
      name: 'Dr. Mehdi Benjelloun', 
      specialty: 'Dentist', 
      clinic: 'Smile Dental Clinic', 
      location: 'Tangier', 
      experience: 8, 
      rating: 4.5, 
      nextAvailable: 'Today 5 PM',
      availability: ['Tue', 'Wed', 'Thu', 'Fri'],
      online: true,
      image: 'assets/doctors/doc6.jpg' 
    }
  ];

  get specialties(): string[] {
    return ['all', ...new Set(this.doctors.map(d => d.specialty))];
  }

  get cities(): string[] {
    return ['all', ...new Set(this.doctors.map(d => d.location))];
  }

  get filteredDoctors() {
    return this.doctors.filter(d =>
      (this.selectedSpecialty === 'all' || d.specialty === this.selectedSpecialty) &&
      (this.selectedCity === 'all' || d.location === this.selectedCity) &&
      (d.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       d.specialty.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       d.clinic.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  onFilterChange() {
    // Filter logic here
  }

  hasActiveFilters(): boolean {
    return this.searchTerm !== '' || 
           this.selectedSpecialty !== 'all' || 
           this.selectedCity !== 'all';
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedSpecialty = 'all';
    this.selectedCity = 'all';
  }

  isToday(day: string): boolean {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    return days[today] === day;
  }

  // ===== Navigation =====
  navigate(path: string) {
    this.router.navigate([path]);
    // Close menu on navigation
    this.registerMenuOpen.set(false);
  }

  smoothScroll(targetId: string) {
    const element = this.document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // ===== Doctor Booking =====
  bookAppointment(doctorId: number) {
    this.router.navigate(['/book', doctorId]);
  }

  // ===== Utility Methods =====
  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  // For testing theme
  testTheme() {
    console.log('Current theme:', this.theme);
    console.log('Body attribute:', this.document.body.getAttribute('data-theme'));
    console.log('HTML attribute:', this.document.documentElement.getAttribute('data-theme'));
    console.log('Is dark:', this.isDark);
  }
}