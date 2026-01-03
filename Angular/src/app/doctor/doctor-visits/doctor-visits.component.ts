import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './doctor-visits.component.html',
  styleUrls: ['./doctor-visits.component.css']
})
export class DoctorVisitsComponent {

  showModal = false;

  visits: Visit[] = [
    {
      patientName: 'Michael Chen',
      date: '2024-12-10 10:00',
      status: 'Completed',
      diagnosis: 'Hypertension',
      notes: 'Blood pressure elevated.',
      prescriptions: ['Lisinopril 10mg']
    }
  ];

  openNewVisit() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  confirmAddVisit() {
    this.visits.unshift({
      patientName: 'New Patient',
      date: new Date().toLocaleString(),
      status: 'Pending',
      diagnosis: 'Not defined',
      notes: 'New visit added.',
      prescriptions: ['—']
    });

    this.closeModal();
  }

  deleteVisit(index: number) {
    this.visits.splice(index, 1);
  }
}
