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
    { id: 'P004', name: 'Sarah Williams', age: 27, gender: 'Female', bloodType: 'AB+' }
  ];
  searchText: string = '';

  get filteredPatients() {
    if (!this.searchText) return this.patients;
    return this.patients.filter(p =>
      p.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      p.id.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  viewPatient(patient: Patient) { alert(`Viewing ${patient.name}`); }
  addPatient() { alert('Add patient clicked!'); }
}

