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
  currentFlag = 'https://flagcdn.com/gb.svg';

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
      loginLink: 'Login here',
      backToHome: 'Back to home'
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
      loginLink: "Connectez-vous",
      backToHome: "Retour à l'accueil"
    }
  };

  t(key: string) {
    return this.translations[this.currentLang]?.[key] ?? key;
  }

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      birthDate: ['', Validators.required],
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      gender: ['', Validators.required],
      allergies: ['']
    });
  }

  selectGender(g: 'male' | 'female') {
    this.selectedGender = g;
    this.form.get('gender')?.setValue(g);
  }
  toggleLanguageMenu() {
    this.showLanguageMenu = !this.showLanguageMenu;
  }

  changeLanguage(lang: 'en' | 'fr') {
    this.currentLang = lang;
    this.currentFlag = lang === 'fr' ? 'https://flagcdn.com/fr.svg' : 'https://flagcdn.com/gb.svg';
    this.showLanguageMenu = false;
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
    const payload = {
      username: val.email,
      password: val.password
    };

    this.submitting = true;
    this.auth.registerPatient(payload).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.successMessage = 'Registration successful! Redirecting...';
        
        // Set auth context immediately
        this.auth.setRole('PATIENT');
        this.auth.setUsername(val.email);
        
        // Navigate immediately after setting context
        setTimeout(() => {
          this.submitting = false;
          console.log('Navigating to /patient-page/dash');
          this.router.navigate(['/patient-page/dash'], { replaceUrl: true }).then(
            (navSuccess) => {
              console.log('Navigation result:', navSuccess);
              if (!navSuccess) {
                console.error('Navigation returned false');
              }
            },
            (navError) => {
              console.error('Navigation promise rejected:', navError);
            }
          );
        }, 500);
      },
      error: (err) => {
        console.error('Patient registration failed', err);
        this.errorMessage = 'Registration failed. Please try again.';
        this.submitting = false;
      }
    });
  }
}
