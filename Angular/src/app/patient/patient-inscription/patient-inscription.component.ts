import { Component  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink  } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, RouterLink],
  selector: 'app-patient-inscription',
  templateUrl: './patient-inscription.component.html',
  styleUrls: ['./patient-inscription.component.css']
})
export class PatientInscriptionComponent {
  form: FormGroup;
  showLanguageMenu = false;
  showUserMenu = false;
  submitting = false;
  successMessage = '';
  errorMessage = '';
  selectedGender: 'male' | 'female' | null = null;
  currentLang = 'en';

  translations: Record<string, Record<string, string>> = {
    en: {
      title: 'Patient Registration',
      subtitle: 'Fill in your details to join',
      fullName: 'Full Name',
      birthDate: 'Date of Birth',
      email: 'Email',
      password: 'Password',
      gender: 'Gender',
      allergies: 'Allergies',
      register: 'Register',
      alreadyAccountPrefix: 'Already have an account?',
      loginLink: 'Login here'
    },
    fr: {
      title: "Inscription Patient",
      subtitle: "Remplissez vos informations pour rejoindre",
      fullName: "Nom complet",
      birthDate: "Date de naissance",
      email: "E-mail",
      password: "Mot de passe",
      gender: "Genre",
      allergies: "Allergies",
      register: "S'inscrire",
      alreadyAccountPrefix: "Vous avez déjà un compte ?",
      loginLink: "Connectez-vous"
    }
  };

  t(key: string) {
    return this.translations[this.currentLang]?.[key] ?? key;
  }

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      birthDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      gender: ['', Validators.required],
      allergies: ['']
    });
  }

  selectGender(g: 'male' | 'female') {
    this.selectedGender = g;
    this.form.get('gender')?.setValue(g);
  }
  toggleLanguage() {
  this.showLanguageMenu = !this.showLanguageMenu;
}
   toggleUserMenu() {
  this.showUserMenu = !this.showUserMenu;
}
  onSubmit() {
    if (this.form.invalid || !this.selectedGender) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;
    const fd = new FormData();
    fd.append('fullName', val.fullName);
    fd.append('birthDate', val.birthDate);
    fd.append('email', val.email);
    fd.append('password', val.password);
    fd.append('gender', val.gender);
    fd.append('allergies', val.allergies);

    this.submitting = true;
    this.auth.registerPatient(fd).subscribe({
      next: () => {
        this.successMessage = 'Registration successful';
        this.submitting = false;
        this.router.navigate(['/']); // redirect to home/login
      },
      error: () => {
        this.errorMessage = 'Registration failed. Please try again.';
        this.submitting = false;
      }
    });
  }
}
