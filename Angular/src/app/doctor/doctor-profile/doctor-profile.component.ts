import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DoctorProfile {
  name: string;
  city: string;
  address: string;
  phone: string;
  fax: string;
  email: string;
  specialty: string;
}

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent {
  edit = false;

  profile: DoctorProfile = {
    name: 'Dr. Sarah Bennani',
    city: 'Casablanca',
    address: '123 Medical Ave, Building B',
    phone: '+212 6 12 34 56 78',
    fax: '+212 5 22 33 44 55',
    email: 's.bennani@medmanager.com',
    specialty: 'Cardiology — Interventional'
  };

  draft: DoctorProfile = { ...this.profile };

  startEdit() {
    this.draft = { ...this.profile };
    this.edit = true;
  }

  cancel() {
    this.edit = false;
  }

  save() {
    this.profile = { ...this.draft };
    this.edit = false;
    console.log('Profile saved', this.profile);
  }
}
