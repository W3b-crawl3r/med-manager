import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PatientService, Patient } from '../../services/patient.service';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent implements OnInit {
  

  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchQuery: string = '';
  showForm = false;

  // Champ texte pour allergies
  allergiesInput: string = '';

  newPatient: Patient = {
    id: '',
    fullName: '',
    age: 0,
    gender: '',
    bloodType: '',
    phone: '',
    email: '',
    address: '',
    allergies: []
  };

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.patients = this.patientService.getAllPatients();
    this.filteredPatients = this.patients;
  }

  filterPatients(): void {
    this.filteredPatients = this.patientService.searchPatients(this.searchQuery);
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  addPatient(patientForm: NgForm) {
    if (patientForm.invalid) {
      patientForm.form.markAllAsTouched();
      return;
    }

    // Convertir allergies string → tableau
    this.newPatient.allergies = this.allergiesInput
      .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0);

    // Générer un ID
    this.newPatient.id = this.patientService.generateNextId();

    // Ajouter via le service
    this.patientService.addPatient(this.newPatient).subscribe({
      next: () => {
        this.filteredPatients = this.patientService.getAllPatients();
        this.resetForm();
        this.showForm = false;
      },
      error: (err) => console.error('Erreur ajout patient', err)
    });
  }

  resetForm() {
    this.newPatient = {
      id: '',
      fullName: '',
      age: 0,
      gender: '',
      bloodType: '',
      phone: '',
      email: '',
      address: '',
      allergies: []
    };
    this.allergiesInput = '';
    this.showForm = false;
  }
}
