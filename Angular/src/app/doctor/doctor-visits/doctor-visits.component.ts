import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Visit {
  patientName: string;
  date: string;
  status: 'Completed' | 'Pending';
  diagnosis: string;
  notes: string;
  prescriptions: string[];
}

@Component({
  selector: 'app-doctor-visits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-visits.component.html',
  styleUrls: ['./doctor-visits.component.css']
})
export class DoctorVisitsComponent {

  showModal = false;
  visits: Visit[] = [];

  // form model for creating a new visit
  newVisit: any = {
    patientName: '',
    date: new Date().toISOString().slice(0,16),
    status: 'Pending',
    diagnosis: '',
    notes: '',
    prescriptions: [],
    prescriptionsString: ''
  };

  selectedVisit: Visit | null = null;
  showDetails = false;

  // load patients list from stored patients (fallback to seeded names)
  patientsList: string[] = [];

  // parameters/filters
  filterStatus: 'all' | 'Completed' | 'Pending' = 'all';
  filterFrom = '';
  filterTo = '';

  get filteredVisits() {
    return this.visits.filter(v => {
      if (this.filterStatus !== 'all' && v.status !== this.filterStatus) return false;
      if (this.filterFrom) {
        const from = new Date(this.filterFrom);
        const vd = new Date(v.date);
        if (vd < from) return false;
      }
      if (this.filterTo) {
        const to = new Date(this.filterTo);
        const vd = new Date(v.date);
        if (vd > to) return false;
      }
      return true;
    });
  }

  openNewVisit() {
    this.resetNewVisit();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  confirmAddVisit() {
    // basic validation
    if (!this.newVisit.patientName || !this.newVisit.date) {
      alert('Please provide patient name and date');
      return;
    }

    // parse prescriptions string into array
    const presRaw = (this.newVisit.prescriptionsString || '').trim();
    const presArr = presRaw ? presRaw.split(',').map((s: string) => s.trim()).filter((s: string) => !!s) : [];
    const toSave: Visit = {
      patientName: this.newVisit.patientName,
      date: this.newVisit.date,
      status: this.newVisit.status,
      diagnosis: this.newVisit.diagnosis || '—',
      notes: this.newVisit.notes || '—',
      prescriptions: presArr.length ? presArr : ['—']
    };

    this.visits.unshift(toSave);
    this.saveVisits();
    this.closeModal();
  }

  viewVisitDetails(v: Visit) {
    this.selectedVisit = v;
    this.showDetails = true;
  }

  closeDetails() {
    this.selectedVisit = null;
    this.showDetails = false;
  }

  deleteVisit(index: number) {
    this.visits.splice(index, 1);
    this.saveVisits();
  }

  // persistence
  constructor() {
    try {
      const raw = localStorage.getItem('doctorVisits');
      if (raw) this.visits = JSON.parse(raw);
      else {
        // seed with example if nothing stored
        this.visits = [
          {
            patientName: 'Michael Chen',
            date: '2024-12-10 10:00',
            status: 'Completed',
            diagnosis: 'Hypertension',
            notes: 'Blood pressure elevated.',
            prescriptions: ['Lisinopril 10mg']
          }
        ];
      }
    } catch (e) {
      this.visits = [];
    }

    // load patients from localStorage doctorPatients if present
    try {
      const rawP = localStorage.getItem('doctorPatients');
      if (rawP) {
        const arr = JSON.parse(rawP) as Array<any>;
        this.patientsList = arr.map(p => p.name).filter(Boolean);
      }
    } catch (e) {
      // fallback to defaults if not available
    }
    if (!this.patientsList.length) {
      this.patientsList = ['Michael Chen','Emma Rodriguez','David Thompson','Sarah Williams','Aisha Ben','Omar Haddad'];
    }
  }

  saveVisits() {
    try { localStorage.setItem('doctorVisits', JSON.stringify(this.visits)); } catch (e) {}
  }

  resetNewVisit() {
    this.newVisit = {
      patientName: this.patientsList[0] || '',
      date: new Date().toISOString().slice(0,16),
      status: 'Pending',
      diagnosis: '',
      notes: '',
      prescriptions: [],
      prescriptionsString: ''
    };
  }
}
