import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-doctor-inscription',
  templateUrl: './doctor-inscription.component.html',
  styleUrls: ['./doctor-inscription.component.css']
})
export class DoctorInscriptionComponent {
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    specialty: ['', Validators.required],
    phone: ['', Validators.required],
    licenseNumber: ['', Validators.required]
  });

  submitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.auth.registerDoctor(this.form.value).subscribe({
      next: () => {
        this.successMessage = 'Registration successful';
        this.submitting = false;
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMessage = 'Registration failed. Please try again.';
        this.submitting = false;
      }
    });
  }
}
