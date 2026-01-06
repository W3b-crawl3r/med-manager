import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  clinic?: string;
  location?: string;
  image?: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  doctorId!: number;
  doctor: Doctor | null = null;
  availableTimes: string[] = [];
  selectedTime = '';
  selectedDate = '';
  // search view state
  searchTerm = '';
  selectedSpecialty = 'all';
  selectedCity = 'all';
  // pagination and time options
  pageIndex = 0;
  pageSize = 5;
  timeOptions: string[] = [];
  // quick pick: selected day (Mon..Sun) and period
  selectedDay = '';
  selectedPeriod: 'all' | 'morning' | 'afternoon' | 'evening' | 'night' = 'all';
  filteredTimes: string[] = [];
  // quick-pick weekday helper
  weekdayLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  weekdayOrder = [1,2,3,4,5,6,0];
  selectedWeekday: number | null = null;
  availableTimesByWeekday: Record<number, string[]> = {};

  // small mock of doctors and slots — replace with API calls as needed
  private doctors: Doctor[] = [
    { id: 1, name: 'Dr. Sarah Bennani', specialty: 'Cardiologist', location: 'Casablanca', clinic: 'Heart Care', image: 'assets/doctors/doc1.jpg' },
    { id: 2, name: 'Dr. Youssef Amrani', specialty: 'Dermatologist', location: 'Rabat', clinic: 'Skin Center', image: 'assets/doctors/doc2.jpg' },
    { id: 3, name: 'Dr. Amina El Fassi', specialty: 'Pediatrician', location: 'Marrakech', clinic: 'Children\'s Health', image: 'assets/doctors/doc3.jpg' },
    { id: 4, name: 'Dr. Karim Bouzidi', specialty: 'Orthopedic Surgeon', location: 'Casablanca', clinic: 'Bone & Joint', image: 'assets/doctors/doc4.jpg' },
    { id: 5, name: 'Dr. Fatima Zahra Alaoui', specialty: 'Neurologist', location: 'Rabat', clinic: 'Neuro Care', image: 'assets/doctors/doc5.jpg' },
    { id: 6, name: 'Dr. Mehdi Benjelloun', specialty: 'Dentist', location: 'Tangier', clinic: 'Smile Dental', image: 'assets/doctors/doc6.jpg' }
  ];

  private doctorSlots: Record<number, string[]> = {
    1: ['09:00', '09:30', '10:30', '14:00', '15:30'],
    2: ['08:30', '10:00', '11:30', '13:00'],
    3: ['09:15', '09:45', '11:00', '16:00'],
    4: ['10:00', '12:30', '15:00'],
    5: ['09:00', '10:30', '14:30'],
    6: ['08:00', '09:30', '10:00', '11:00']
  };

  // mock availability by day for each doctor (short weekday names)
  private doctorAvailability: Record<number, string[]> = {
    1: ['Mon','Wed','Fri','Sat'],
    2: ['Tue','Thu','Sat'],
    3: ['Mon','Tue','Wed','Thu','Fri'],
    4: ['Wed','Thu','Sat'],
    5: ['Mon','Fri'],
    6: ['Tue','Wed','Thu','Fri']
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.doctorId = id;
    this.doctor = this.doctors.find(d => d.id === id) ?? null;

    // compute union of all times from doctorSlots
    const times = new Set<string>();
    Object.values(this.doctorSlots).forEach(arr => arr.forEach(t => times.add(t)));
    this.timeOptions = Array.from(times).sort();

    // subscribe to optional query params (date/time) when navigating from search
    this.route.queryParamMap.subscribe(q => {
      const qDate = q.get('date');
      const qTime = q.get('time');
      if (qDate) this.selectedDate = qDate;
      if (qTime) this.selectedTime = qTime;
      this.loadAvailableTimes();
      this.pageIndex = 0;
    });

    this.loadAvailableTimes();

    // load last search/book state
    try {
      const last = localStorage.getItem('lastBookingSearch');
      if (last) {
        const s = JSON.parse(last);
        this.selectedDate = s.selectedDate || this.selectedDate;
        this.selectedTime = s.selectedTime || this.selectedTime;
        this.selectedSpecialty = s.selectedSpecialty || this.selectedSpecialty;
      }
    } catch (e) {}
    this.initAvailableTimes();
  }

  get specialties(): string[] {
    return ['all', ...Array.from(new Set(this.doctors.map(d => d.specialty)))];
  }

  get cities(): string[] {
    return ['all', ...Array.from(new Set(this.doctors.map(d => d.location || 'Unknown')))].filter(Boolean);
  }

  filteredDoctors() {
    const term = this.searchTerm.trim().toLowerCase();
    let list = this.doctors.filter(d =>
      (this.selectedSpecialty === 'all' || d.specialty === this.selectedSpecialty) &&
      (this.selectedCity === 'all' || (d.location || '') === this.selectedCity) &&
      (term === '' || d.name.toLowerCase().includes(term) || d.specialty.toLowerCase().includes(term) || (d.clinic || '').toLowerCase().includes(term))
    );

    // If user selected a date, require doctor availability that weekday
    if (this.selectedDate) {
      const day = this.getDayShortFromDate(this.selectedDate);
      list = list.filter(d => (this.doctorAvailability[d.id] || []).includes(day));
    }

    // If user also selected a specific time, require slot availability
    if (this.selectedTime) {
      list = list.filter(d => (this.doctorSlots[d.id] || []).includes(this.selectedTime));
    }

    return list;
  }

  getInitials(name?: string): string {
    if (!name) return '';
    const parts = name.split(' ').filter(p => !!p);
    return parts.map(p => p.charAt(0)).slice(0, 2).join('');
  }

  loadAvailableTimes() {
    this.availableTimes = this.doctorSlots[this.doctorId] ?? [];
    // derive selectedDay from selectedDate when available
    if (this.selectedDate) {
      this.selectedDay = this.getDayShortFromDate(this.selectedDate);
    }
    this.filterTimesBySelection();
    this.saveLastSearch();
  }

  private hourFromTime(t: string) {
    const [hh, mm] = t.split(':').map(n => parseInt(n, 10));
    return hh + (mm >= 30 ? 0.5 : 0);
  }

  filterTimesBySelection() {
    const slots = this.availableTimes || [];

    // if a date is selected, ensure doctor is available that weekday
    if (this.selectedDate && this.doctor) {
      const day = this.getDayShortFromDate(this.selectedDate);
      const availableOnDay = (this.doctorAvailability[this.doctor.id] || []).includes(day);
      if (!availableOnDay) {
        this.filteredTimes = [];
        return;
      }
    }

    // apply period filter
    this.filteredTimes = slots.filter(t => {
      if (this.selectedPeriod === 'all') return true;
      const h = this.hourFromTime(t);
      switch (this.selectedPeriod) {
        case 'morning': return h >= 7 && h < 12;
        case 'afternoon': return h >= 12 && h < 17;
        case 'evening': return h >= 17 && h < 20;
        case 'night': return h >= 20;
      }
      return true;
    });
  }

  private getDayShortFromDate(d: string) {
    const dt = new Date(d + 'T00:00');
    return dt.toLocaleDateString('en-US', { weekday: 'short' });
  }

  isAuthenticated(): boolean {
    // Simple check: replace with real auth check
    return !!localStorage.getItem('patientId');
  }

  onConfirm() {
    if (!this.selectedTime) return;

    if (!this.isAuthenticated()) {
      // store attempted booking info so we can resume after sign-up
      localStorage.setItem('pendingBooking', JSON.stringify({ doctorId: this.doctorId, date: this.selectedDate, time: this.selectedTime }));
      this.router.navigate(['/patient-inscription']);
      return;
    }

    // simulate successful booking
    alert(`Appointment booked with ${this.doctor?.name} on ${this.selectedDate} at ${this.selectedTime}`);
    // Optionally navigate to patient dashboard or confirmation page
    this.saveLastSearch();
    this.router.navigate(['/']);
  }

  // navigate to per-doctor booking, carrying date/time via query params if present
  selectDoctor(id: number) {
    const qp: any = {};
    if (this.selectedDate) qp.date = this.selectedDate;
    if (this.selectedTime) qp.time = this.selectedTime;
    this.router.navigate(['/book', id], { queryParams: qp });
  }

  // Pagination
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredDoctors().length / this.pageSize));
  }

  paginatedDoctors(): Doctor[] {
    const list = this.filteredDoctors();
    const start = this.pageIndex * this.pageSize;
    return list.slice(start, start + this.pageSize);
  }

  nextPage() { if (this.pageIndex < this.totalPages - 1) this.pageIndex++; }
  prevPage() { if (this.pageIndex > 0) this.pageIndex--; }

  goBack() {
    this.router.navigate(['/']);
  }

  // booking helpers
  pickWeekday(jsWeekday: number) {
    this.selectedWeekday = jsWeekday;
    const slots = this.doctorSlots[this.doctorId] || [];
    const today = new Date();
    const todayIndex = today.getDay();
    if (jsWeekday === todayIndex) {
      const nowMinutes = today.getHours() * 60 + today.getMinutes();
      const future = slots.find(s => {
        const [h,m] = s.split(':').map(Number); return (h*60+m) > nowMinutes;
      });
      if (future) this.selectedDate = today.toISOString().split('T')[0];
      else this.selectedDate = this.nextDateForWeekday(jsWeekday);
    } else {
      this.selectedDate = this.nextDateForWeekday(jsWeekday);
    }
    // refresh available times
    this.loadAvailableTimes();
    // set filteredTimes to intersection of slots and period
    this.filteredTimes = this.availableTimes.filter(t => {
      if (this.selectedPeriod === 'all') return true;
      const h = this.hourFromTime(t);
      switch (this.selectedPeriod) {
        case 'morning': return h >= 7 && h < 12;
        case 'afternoon': return h >= 12 && h < 17;
        case 'evening': return h >= 17 && h < 20;
        case 'night': return h >= 20;
      }
      return true;
    });
    if (this.filteredTimes.length) this.selectedTime = this.filteredTimes[0];
    this.saveLastSearch();
  }

  selectTime(t: string) {
    this.selectedTime = t;
    this.saveLastSearch();
  }

  nextDateForWeekday(targetWeekday: number): string {
    const today = new Date();
    const todayIndex = today.getDay();
    let daysAhead = (targetWeekday - todayIndex + 7) % 7;
    if (daysAhead === 0) daysAhead = 7;
    const next = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysAhead);
    return next.toISOString().split('T')[0];
  }

  initAvailableTimes() {
    // simple reuse of doctorSlots; could extend per-weekday if API provided
    // No-op here; kept for parity with appointment component
  }

  saveLastSearch() {
    try { localStorage.setItem('lastBookingSearch', JSON.stringify({ selectedDate: this.selectedDate, selectedTime: this.selectedTime, selectedSpecialty: this.selectedSpecialty })); } catch (e) {}
  }
}
