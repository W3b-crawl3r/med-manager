import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-patient-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule   // ✅ THIS FIXES routerLink ERROR
  ],
  templateUrl: './patient-login.component.html',
  styleUrls: ['./patient-login.component.css']
})
export class PatientLoginComponent {
  form: FormGroup;
  submitting = false;
  errorMessage = '';
  private DEMO_EMAIL = 'patient@medmanager.com';
  private DEMO_PASSWORD = 'patient123';
  showLanguageMenu = false;
  currentLang = 'en';
  currentFlag = 'https://flagcdn.com/gb.svg';

  translations: Record<string, Record<string, string>> = {
    en: {
      title: 'Patient Login',
      subtitle: 'Access your MedManager portal',
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
      title: 'Connexion Patient',
      subtitle: 'Accédez à votre portail MedManager',
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
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value;
    this.submitting = true;
    this.errorMessage = '';

    // ✅ DEMO LOGIN (early return, clean)
    if (
      payload?.email === this.DEMO_EMAIL &&
      payload?.password === this.DEMO_PASSWORD
    ) {
      this.auth.setToken('demo-patient-token');
      this.auth.setRole('PATIENT');
      this.submitting = false;
      this.router.navigate(['/']);
      return;
    }

    // ✅ REAL LOGIN
    this.auth.loginPatient(payload).subscribe({
      next: (response: any) => {
        const token = response.token || 'patient-token-placeholder';
        this.auth.setToken(token);
        this.auth.setRole('PATIENT');
        this.submitting = false;
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.errorMessage = 'Account not found. Please register first.';
        } else if (err.status === 401) {
          this.errorMessage = 'Invalid email or password.';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
        this.submitting = false;
      }
    });
  }
}
