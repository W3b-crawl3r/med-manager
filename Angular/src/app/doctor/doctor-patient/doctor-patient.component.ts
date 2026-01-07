import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- for ngModel

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
}
@Component({
  selector: 'app-patients',
  standalone: true, // <-- make it standalone
  imports: [CommonModule, FormsModule], // <-- import FormsModule here
  templateUrl: './doctor-patient.component.html',
  styleUrls: ['./doctor-patient.component.css']
})
export class DoctorPatientComponent {

  patients: Patient[] = [
    { id: 'P001', name: 'Michael Chen', age: 45, gender: 'Male', bloodType: 'O+' },
    { id: 'P002', name: 'Emma Rodriguez', age: 32, gender: 'Female', bloodType: 'A+' },
    { id: 'P003', name: 'David Thompson', age: 58, gender: 'Male', bloodType: 'B+' },
    { id: 'P004', name: 'Sarah Williams', age: 27, gender: 'Female', bloodType: 'AB+' },
    { id: 'P005', name: 'Aisha Ben', age: 36, gender: 'Female', bloodType: 'O-' },
    { id: 'P006', name: 'Omar Haddad', age: 50, gender: 'Male', bloodType: 'A-' }
  ];
  searchText: string = '';

  selectedPatient: Patient | null = null;
  showDetails = false;
  editingPatient = false;
  isNewPatient = false;

  getInitials(name: string) {
    if (!name) return '';
    const parts = name.split(' ').filter(p => p);
    return parts.map(p => p[0]).slice(0,2).join('');
  }

  get filteredPatients() {
    if (!this.searchText) return this.patients;
    return this.patients.filter(p =>
      p.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      p.id.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  viewPatient(patient: Patient) { this.selectedPatient = patient; this.showDetails = true; this.editingPatient = false; this.isNewPatient = false; }
  closeDetails() { this.selectedPatient = null; this.showDetails = false; this.editingPatient = false; this.isNewPatient = false; }
  addPatient() {
    // open modal with empty patient for creation
    const newId = this.generatePatientId();
    this.selectedPatient = { id: newId, name: '', age: 0, gender: 'Other', bloodType: '' };
    this.isNewPatient = true;
    this.editingPatient = true;
    this.showDetails = true;
  }

  savePatient() {
    if (this.selectedPatient) {
      if (this.isNewPatient) {
        this.patients.push(this.selectedPatient);
      } else {
        // update existing patient already bound to selectedPatient
        const idx = this.patients.findIndex(p => p.id === this.selectedPatient!.id);
        if (idx >= 0) this.patients[idx] = this.selectedPatient;
      }
    }
    try { localStorage.setItem('doctorPatients', JSON.stringify(this.patients)); } catch (e) {}
    this.editingPatient = false;
    this.showDetails = false;
    this.isNewPatient = false;
    alert('Patient saved.');
  }

  enableEditing() {
    this.editingPatient = true;
  }

  constructor() {
    try {
      const raw = localStorage.getItem('doctorPatients');
      if (raw) this.patients = JSON.parse(raw);
    } catch (e) {}
  }

  generatePatientId(): string {
    const next = this.patients.length + 1;
    return `P${String(next).padStart(3,'0')}`;
  }
}

