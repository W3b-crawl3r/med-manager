import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  showLanguageMenu = false;
  currentLang = 'en';
  currentFlag = 'https://flagcdn.com/gb.svg';

  translations: Record<string, Record<string, string>> = {
    en: {
      title: 'Doctor Login',
      subtitle: 'Access your MedManager account',
      email: 'Email',
      emailPlaceholder: 'Enter your email',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      login: 'Login',
      loggingIn: 'Logging in...',
      noAccount: "Don't have an account?",
      registerLink: 'Register here',
      registerHere: 'Create account here',
      backToHome: 'Back to home'
    },
    fr: {
      title: 'Connexion Médecin',
      subtitle: 'Accédez à votre compte MedManager',
      email: 'E-mail',
      emailPlaceholder: 'Entrez votre e-mail',
      password: 'Mot de passe',
      passwordPlaceholder: 'Entrez votre mot de passe',
      login: 'Se connecter',
      loggingIn: 'Connexion...',
      noAccount: "Vous n'avez pas de compte ?",
      registerLink: 'Inscrivez-vous',
      registerHere: 'Créer un compte ici',
      backToHome: "Retour à l'accueil"
    }
  };

  t(key: string) {
    return this.translations[this.currentLang]?.[key] ?? key;
  }

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      // Treat this as username field (backend expects username, not necessarily an email)
      email: ['', [Validators.required]],
      // Match seeded backend passwords like "pass6" (length 5)
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  toggleLanguageMenu() {
    this.showLanguageMenu = !this.showLanguageMenu;
  }

  changeLanguage(lang: string) {
    this.currentLang = lang;
    this.currentFlag = lang === 'fr' ? 'https://flagcdn.com/fr.svg' : 'https://flagcdn.com/gb.svg';
    this.showLanguageMenu = false;
  }

  onSubmit() {
    console.log('onSubmit called');
    console.log('Form valid:', this.form.valid);
    console.log('Form value:', this.form.value);
    
    if (this.form.invalid) {
      console.log('Form is invalid');
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value;
    this.submitting = true;
    this.errorMessage = '';

    // ✅ REAL LOGIN
    console.log('Making login request with payload:', payload);
    this.auth.loginDoctor(payload).subscribe({
      next: (response: any) => {
        console.log('Login response received:', response);
        if (!response?.token) {
          throw new Error('Token missing');
        }

        console.log('Login successful, setting token and navigating');
        this.auth.setToken(response.token);
        this.auth.setRole('DOCTOR');
        this.auth.setUsername(payload.email);
        this.submitting = false;
        this.router.navigate(['/doctor-page/dash']);
      },

      error: (err: any) => {
        console.log('Login error:', err);
        if (err.status === 404) {
          this.errorMessage = 'Account not found. Please register first.';
        } else if (err.status === 401) {
          this.errorMessage = 'Invalid email or password.';
        } else if (err.status === 403) {
          this.errorMessage = 'Access denied. Please check your credentials.';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
        this.submitting = false;
      },

      complete: () => {
        console.log('Login request completed');
        this.submitting = false;
      }
    });
  }
}
