import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-patient-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './patient-layout.component.html',
  styleUrls: ['./patient-layout.component.css']
})
export class PatientLayoutComponent {}
