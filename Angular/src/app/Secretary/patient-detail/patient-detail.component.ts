import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PatientService, Patient } from '../../services/patient.service';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./patient-detail.component.css'],
  templateUrl: './patient-detail.component.html',

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
