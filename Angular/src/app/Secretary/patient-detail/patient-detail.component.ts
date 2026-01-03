import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PatientService, Patient } from '../../services/patient.service';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="patient-profile-container">
      <div class="patient-profile" *ngIf="patient">
        <div class="profile-header">
          <button class="close-btn" (click)="goBack()">✕</button>
          <div class="avatar-lg">{{ patient.fullName.charAt(0).toUpperCase() }}</div>
        </div>

        <div class="tabs">
          <button class="tab-btn" [class.active]="activeTab === 'info'" (click)="activeTab = 'info'">Info</button>
          <button class="tab-btn" [class.active]="activeTab === 'visits'" (click)="activeTab = 'visits'">Visits</button>
          <button class="tab-btn" [class.active]="activeTab === 'history'" (click)="activeTab = 'history'">History</button>
        </div>

        <div class="tab-content" *ngIf="activeTab === 'info'">
          <div class="info-group">
            <label>Full Name</label>
            <p class="value">{{ patient.fullName }}</p>
          </div>

          <div class="info-row">
            <div class="info-group">
              <label>Age</label>
              <p class="value">{{ patient.age }} years</p>
            </div>
            <div class="info-group">
              <label>Blood Type</label>
              <p class="value">{{ patient.bloodType }}</p>
            </div>
          </div>

          <div class="info-group">
            <label>Gender</label>
            <p class="value">{{ patient.gender }}</p>
          </div>

          <div class="info-row">
            <div class="info-group">
              <label>Phone</label>
              <p class="value">{{ patient.phone }}</p>
            </div>
            <div class="info-group">
              <label>Email</label>
              <p class="value">{{ patient.email }}</p>
            </div>
          </div>

          <div class="info-group">
            <label>Address</label>
            <p class="value">{{ patient.address }}</p>
          </div>

          <div class="info-group">
            <label>Allergies</label>
            <div class="allergies">
              <span class="allergy-tag" *ngFor="let allergy of patient.allergies">{{ allergy }}</span>
              <span *ngIf="patient.allergies.length === 0" class="no-allergies">No known allergies</span>
            </div>
          </div>
        </div>

        <div class="tab-content" *ngIf="activeTab === 'visits'">
          <p>Coming soon...</p>
        </div>

        <div class="tab-content" *ngIf="activeTab === 'history'">
          <p>Coming soon...</p>
        </div>
      </div>

      <div class="loading" *ngIf="!patient">
        Loading patient information...
      </div>
    </div>
  `,
  styles: [`
    .patient-profile-container {
      max-width: 600px;
      margin: 2rem auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .patient-profile {
      position: relative;
    }

    .profile-header {
      padding: 2rem;
      position: relative;
    }

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 32px;
      height: 32px;
      border: none;
      background: #f3f4f6;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      background: #e5e7eb;
    }

    .avatar-lg {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #dbeafe;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: bold;
      color: #1e40af;
      margin: 0 auto;
    }

    .tabs {
      display: flex;
      border-bottom: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    .tab-btn {
      flex: 1;
      padding: 1rem;
      border: none;
      background: none;
      cursor: pointer;
      color: #6b7280;
      font-weight: 500;
      border-bottom: 3px solid transparent;
    }

    .tab-btn.active {
      color: #1e40af;
      border-bottom-color: #3b82f6;
    }

    .tab-content {
      
          flex: 1;
        padding: 30px;
        overflow-y: auto;
    }

    .info-group {
      margin-bottom: 1.5rem;
    }

    .info-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 1.5rem;
    }

    .info-group label {
      display: block;
      font-size: 0.875rem;
      color: #9ca3af;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .info-group .value {
      margin: 0;
      font-size: 1.1rem;
      color: #111827;
      font-weight: 600;
    }

    .allergies {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .allergy-tag {
      display: inline-block;
      background: #ef4444;
      color: white;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.875rem;
    }

    .no-allergies {
      color: #10b981;
      font-style: italic;
    }

    .loading {
      padding: 2rem;
      text-align: center;
      color: #6b7280;
    }
  `]
})
export class PatientDetailComponent implements OnInit {
  patient: Patient | null = null;
  activeTab: 'info' | 'visits' | 'history' = 'info';

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.patientService.getPatientById(id).subscribe(patient => {
        this.patient = patient || null;
      });
    }
  }

  goBack() {
    window.history.back();
  }
}
