import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Visit {
  patientName: string;
  date: string; // ISO string
  status: 'Pending' | 'Completed';
  diagnosis: string;
  notes: string;
  prescriptions: string[];
}

@Component({
  selector: 'app-visits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-visits.component.html',
  styleUrls: ['./doctor-visits.component.css']
})
export class DoctorVisitsComponent implements OnInit {

  visits: Visit[] = [
    {
      patientName: 'John Doe',
      date: '2026-01-05 09:00',
      status: 'Completed',
      diagnosis: 'Flu',
      notes: 'Rest and hydration',
      prescriptions: ['Paracetamol']
    },
    {
      patientName: 'Sarah Smith',
      date: '2026-01-06 11:30',
      status: 'Pending',
      diagnosis: 'Back pain',
      notes: 'Recommended physiotherapy',
      prescriptions: ['Ibuprofen']
    },
    {
      patientName: 'Ahmed Ali',
      date: '2026-01-07 14:00',
      status: 'Completed',
      diagnosis: 'Allergy',
      notes: 'Prescribed antihistamine',
      prescriptions: ['Loratadine']
    },
    {
      patientName: 'Fatima Noor',
      date: '2026-01-08 16:00',
      status: 'Pending',
      diagnosis: 'Follow-up',
      notes: 'Check blood results',
      prescriptions: ['—']
    },
    {
      patientName: 'Omar Haddad',
      date: '2026-01-09 10:00',
      status: 'Completed',
      diagnosis: 'Dental check',
      notes: 'Referred to dentist',
      prescriptions: ['—']
    }
  ];

  filteredVisits: Visit[] = [];

  // FILTERS
  filterStatus: 'all' | 'Pending' | 'Completed' = 'all';
  filterFrom = '';
  filterTo = '';

  // MODALS
  showModal = false;
  showDetails = false;
  selectedVisit: Visit | null = null;

  // NEW VISIT
newVisit: {
  patientName: string;
  date: string;
  status: 'Pending' | 'Completed';
  diagnosis: string;
  notes: string;
  prescriptionsString: string;
} = {
  patientName: '',
  date: '',
  status: 'Pending',
  diagnosis: '',
  notes: '',
  prescriptionsString: ''
};


  patientsList = ['John Doe', 'Sarah Smith', 'Ahmed Ali'];

  // TIME PICKER
  weekdayLabels = ['Mon','Tue','Wed','Thu','Fri','Sat'];
  weekdayOrder = [1,2,3,4,5,6]; // ISO weekday
  selectedWeekday: number | null = null;
  selectedPeriod: 'all' | 'morning' | 'evening' = 'all';
  availableTimes: string[] = [];
  selectedTime = '';

  ngOnInit() {
    // load persisted visits if any
    try {
      const raw = localStorage.getItem('doctorVisits');
      if (raw) this.visits = JSON.parse(raw) as Visit[];
    } catch (e) {}
    // try to load patients from persisted store
    try {
      const rawP = localStorage.getItem('doctorPatients');
      if (rawP) {
        const arr = JSON.parse(rawP) as Array<any>;
        if (arr.length) this.patientsList = arr.map(p => p.name).filter(Boolean);
      }
    } catch (e) {}

    this.applyFilters();
  }

  // ================= FILTERS =================
  applyFilters() {
    this.filteredVisits = this.visits.filter(v => {

      if (this.filterStatus !== 'all' && v.status !== this.filterStatus) {
        return false;
      }

      const visitDate = new Date(v.date);

      if (this.filterFrom && visitDate < new Date(this.filterFrom)) {
        return false;
      }

      if (this.filterTo && visitDate > new Date(this.filterTo)) {
        return false;
      }

      return true;
    });
  }

  // ================= MODALS =================
  openNewVisit() {
    this.resetNewVisit();
    this.showDetails = false;
    this.generateTimes();
    // default selected patient
    this.newVisit.patientName = this.patientsList[0] || '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  viewVisitDetails(visit: Visit) {
    this.selectedVisit = visit;
    this.showDetails = true;
  }

  closeDetails() {
    this.showDetails = false;
    this.selectedVisit = null;
  }

  // ================= VISITS =================
  confirmAddVisit() {
    if (!this.newVisit.patientName || !this.newVisit.date) return;

    // normalize date display to YYYY-MM-DD HH:mm
    let displayDate = this.newVisit.date;
    try {
      const dt = new Date(this.newVisit.date);
      displayDate = dt.toISOString().split('.')[0].replace('T', ' ');
    } catch (e) {}

    const visit: Visit = {
      patientName: this.newVisit.patientName,
      date: displayDate,
      status: this.newVisit.status,
      diagnosis: this.newVisit.diagnosis,
      notes: this.newVisit.notes,
      prescriptions: this.newVisit.prescriptionsString
        ? this.newVisit.prescriptionsString.split(',').map(p => p.trim())
        : []
    };

    this.visits.unshift(visit);
    this.saveVisits();
    this.applyFilters();
    this.closeModal();
  }

  deleteVisit(visit: Visit) {
    this.visits = this.visits.filter(v => v !== visit);
    this.saveVisits();
    this.applyFilters();
  }

  saveVisits() {
    try { localStorage.setItem('doctorVisits', JSON.stringify(this.visits)); } catch (e) {}
  }

  // ================= TIME =================
  pickWeekday(day: number) {
    this.selectedWeekday = day;
    this.generateTimes();
  }

  selectPeriod(period: any) {
    this.selectedPeriod = period;
    this.generateTimes();
  }

  generateTimes() {
    if (this.selectedPeriod === 'morning') {
      this.availableTimes = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00'];
    } else if (this.selectedPeriod === 'evening') {
      this.availableTimes = ['17:00','17:30','18:00','18:30','19:00'];
    } else {
      this.availableTimes = ['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00'];
    }
  }

  selectTime(time: string) {
    this.selectedTime = time;
    if (this.selectedWeekday !== null) {
      const iso = this.nextDateForWeekday(this.selectedWeekday);
      this.newVisit.date = `${iso}T${time}`;
    } else {
      const today = new Date();
      const iso = today.toISOString().split('T')[0];
      this.newVisit.date = `${iso}T${time}`;
    }
  }

  formatSelectedDisplay(): string {
    if (!this.selectedTime || this.selectedWeekday === null) return 'No date selected';
    const iso = this.nextDateForWeekday(this.selectedWeekday);
    const idx = this.weekdayOrder.indexOf(this.selectedWeekday);
    const dayLabel = idx >= 0 ? this.weekdayLabels[idx] : '';
    return `${dayLabel} ${iso} at ${this.selectedTime}`;
  }

  getInitials(name?: string): string {
    if (!name) return '';
    const parts = name.split(' ').filter(p => !!p);
    return parts.map(p => p.charAt(0)).slice(0,2).join('').toUpperCase();
  }

  private nextDateForWeekday(targetWeekday: number): string {
    const today = new Date();
    const todayIndex = today.getDay();
    let daysAhead = (targetWeekday - todayIndex + 7) % 7;
    if (daysAhead === 0) daysAhead = 7;
    const next = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysAhead);
    return next.toISOString().split('T')[0];
  }

  // ================= UTILS =================
  resetNewVisit() {
    this.newVisit = {
      patientName: '',
      date: '',
      status: 'Pending',
      diagnosis: '',
      notes: '',
      prescriptionsString: ''
    };
    this.selectedWeekday = null;
    this.selectedPeriod = 'all';
    this.availableTimes = [];
    this.selectedTime = '';
  }
}
