import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PatientService, Patient } from '../../services/patient.service';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="patients-container">
      <div class="sidebar">
        <h2 class="logo">Med Manager</h2>
        <div class="user">
          <div class="avatar">E</div>
          <div>
            <strong>Emily Roberts</strong>
            <span class="role">SECRETARY</span>
          </div>
        </div>
        <nav>
          <a routerLink="/secretary/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/patients" routerLinkActive="active" class="active">Patients</a>
          <a routerLink="/secretary/appointments" routerLinkActive="active">Appointments</a>
        </nav>
      </div>

      <main class="content">
        <div class="header">
          <div>
            <h1>Patients</h1>
            <p class="subtitle">Manage your patient records</p>
          </div>
          <button class="btn-add">+ Add Patient</button>
        </div>

        <div class="search-section">
          <div class="search-box">
            <input 
              type="text" 
              placeholder="Search patients..." 
              [(ngModel)]="searchQuery"
              (input)="filterPatients()"
              class="search-input"
            />
          </div>
        </div>

        <div class="patients-list">
          <div class="patients-header-row">
            <div class="col-avatar"></div>
            <div class="col-name">Name</div>
            <div class="col-id">ID</div>
            <div class="col-age">Age</div>
            <div class="col-gender">Gender</div>
            <div class="col-blood">Blood Type</div>
            <div class="col-action">Action</div>
          </div>

          <div *ngFor="let patient of filteredPatients" class="patient-row">
            <div class="col-avatar">
              <div class="avatar">{{ patient.fullName.charAt(0).toUpperCase() }}</div>
            </div>
            <div class="col-name">{{ patient.fullName }}</div>
            <div class="col-id">{{ patient.id }}</div>
            <div class="col-age">{{ patient.age }} years</div>
            <div class="col-gender">{{ patient.gender }}</div>
            <div class="col-blood">{{ patient.bloodType }}</div>
            <div class="col-action">
              <button class="btn-view" [routerLink]="['/patient-detail', patient.id]">
                👁 View
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="filteredPatients.length === 0" class="empty-state">
          <p>No patients found</p>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .patients-container {
      display: flex;
      min-height: 100vh;
      background: #f9fafb;
    }

    .sidebar {
      width: 250px;
      background: white;
      border-right: 1px solid #e5e7eb;
      padding: 2rem 1rem;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
    }

    .logo {
      margin: 0 0 2rem 0;
      color: #1f2937;
      font-size: 1.5rem;
    }

    .user {
      display: flex;
      gap: 1rem;
      align-items: center;
      padding: 1rem;
      background: #f3f4f6;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .avatar {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background: #3b82f6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .user strong {
      display: block;
      color: #111827;
      font-size: 0.9rem;
    }

    .role {
      display: block;
      background: #10b981;
      color: white;
      font-size: 0.7rem;
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-weight: bold;
      margin-top: 0.2rem;
      width: fit-content;
    }

    nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    nav a {
      padding: 0.75rem 1rem;
      color: #6b7280;
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.2s;
    }

    nav a:hover {
      background: #f3f4f6;
      color: #1f2937;
    }

    nav a.active {
      background: #3b82f6;
      color: white;
    }

    .content {
      flex: 1;
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }

    .header h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      color: #111827;
    }

    .subtitle {
      margin: 0;
      color: #6b7280;
    }

    .btn-add {
      background: #3b82f6;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn-add:hover {
      background: #2563eb;
    }

    .search-section {
      margin-bottom: 2rem;
    }

    .search-input {
      width: 100%;
      max-width: 400px;
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 1rem;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .patients-list {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e5e7eb;
    }

    .patients-header-row {
      display: grid;
      grid-template-columns: 50px 200px 80px 80px 100px 100px 100px;
      gap: 1rem;
      padding: 1rem;
      background: #f9fafb;
      border-bottom: 2px solid #e5e7eb;
      font-weight: 600;
      color: #6b7280;
      font-size: 0.875rem;
      text-transform: uppercase;
    }

    .patient-row {
      display: grid;
      grid-template-columns: 50px 200px 80px 80px 100px 100px 100px;
      gap: 1rem;
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
      align-items: center;
      transition: all 0.2s;
    }

    .patient-row:hover {
      background: #f9fafb;
    }

    .col-avatar {
      display: flex;
      justify-content: center;
    }

    .col-name {
      font-weight: 500;
      color: #111827;
    }

    .col-id,
    .col-age,
    .col-gender,
    .col-blood {
      color: #374151;
    }

    .col-action {
      text-align: center;
    }

    .btn-view {
      background: #f3f4f6;
      color: #374151;
      padding: 0.5rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-block;
    }

    .btn-view:hover {
      background: #e5e7eb;
      border-color: #9ca3af;
    }

    .empty-state {
      padding: 3rem;
      text-align: center;
      color: #6b7280;
    }
  `]
})
export class PatientsListComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchQuery: string = '';

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    this.patients = this.patientService.getAllPatients();
    this.filteredPatients = this.patients;
  }

  filterPatients() {
    this.filteredPatients = this.patientService.searchPatients(this.searchQuery);
  }
}
