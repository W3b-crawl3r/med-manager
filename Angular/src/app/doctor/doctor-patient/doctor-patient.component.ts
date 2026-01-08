import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- for ngModel
import { DoctorService } from '../../services/doctor.service';
import { AuthService } from '../../services/auth.service';

interface Patient {
  id: string | number;
  name: string;
  age?: number;
  gender?: string;
  bloodType?: string;
}
@Component({
  selector: 'app-patients',
  standalone: true, // <-- make it standalone
  imports: [CommonModule, FormsModule], // <-- import FormsModule here
  templateUrl: './doctor-patient.component.html',
  styleUrls: ['./doctor-patient.component.css']
})
export class DoctorPatientComponent implements OnInit {

  patients: Patient[] = [];
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
      p.id.toString().toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  viewPatient(patient: Patient) { this.selectedPatient = patient; this.showDetails = true; this.editingPatient = false; this.isNewPatient = false; }
  closeDetails() { this.selectedPatient = null; this.showDetails = false; this.editingPatient = false; this.isNewPatient = false; }
  addPatient() {
    alert('Adding patients from UI is not implemented yet.');
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

  constructor(private doctorService: DoctorService, private auth: AuthService) {}

  ngOnInit(): void {
    const username = this.auth.getUsername();
    if (!username) {
      return;
    }
    this.doctorService.getPatients(username).subscribe({
      next: (data) => {
        // Map backend PatientSummaryDto to view model
        this.patients = data.map(p => ({
          id: p.id,
          name: p.username,
          // Age/Gender/BloodType are not in backend yet
        }));
      },
      error: (err) => {
        console.error('Failed to load patients', err);
      }
    });
  }

  generatePatientId(): string {
    const next = this.patients.length + 1;
    return `P${String(next).padStart(3,'0')}`;
  }
}

