import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // 👈 RouterModule REQUIRED

@Component({
  standalone: true,
  selector: 'app-doctor-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule   // ✅ THIS FIXES routerLink ERROR
  ],
  templateUrl: './doctor-login.component.html',
  styleUrls: ['./doctor-login.component.css']
})
export class DoctorLoginComponent {

  form: FormGroup;
  submitting = false;
  errorMessage = '';

  // 🔒 DEMO CREDENTIALS
  private DEMO_EMAIL = 'doctor@medmanager.com';
  private DEMO_PASSWORD = 'doctor123';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.submitting = true;
    this.errorMessage = '';

    const { email, password } = this.form.value;

    setTimeout(() => {
      if (email === this.DEMO_EMAIL && password === this.DEMO_PASSWORD) {
        this.router.navigate(['/doctor-page']);// goes to doctor layout -> dashboard

      } else {
        this.errorMessage = 'Invalid email or password';
      }
      this.submitting = false;
    }, 800);
  }
}
