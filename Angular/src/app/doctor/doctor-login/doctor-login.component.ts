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
private DEMO_EMAIL = 'doctor@medmanager.com';
  private DEMO_PASSWORD = 'doctor123';
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
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    
    // Pre-fill demo credentials for testing
    this.form.patchValue({
      email: this.DEMO_EMAIL,
      password: this.DEMO_PASSWORD
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
    console.log('Login form submitted');
    console.log('Form status:', this.form.status);
    console.log('Form value:', this.form.value);
    console.log('Email control:', { 
      value: this.form.get('email')?.value,
      valid: this.form.get('email')?.valid,
      errors: this.form.get('email')?.errors
    });
    console.log('Password control:', { 
      value: this.form.get('password')?.value,
      valid: this.form.get('password')?.valid,
      errors: this.form.get('password')?.errors
    });
    
    if (this.form.invalid) {
      console.log('Form is invalid');
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value;
    console.log('Login payload:', { email: payload.email, hasPassword: !!payload.password });
    
    this.submitting = true;
    this.errorMessage = '';
    
    // ✅ DEMO LOGIN (early return, clean)
    if (
      payload?.email === this.DEMO_EMAIL &&
      payload?.password === this.DEMO_PASSWORD
    ) {
      console.log('Demo login successful');
      this.auth.setToken('demo-doctor-token');
      this.auth.setRole('DOCTOR');
      this.submitting = false;
      this.router.navigate(['/doctor-page/dash']);
      return;
    }

    // ✅ REAL LOGIN
    console.log('Attempting real backend login...');
    this.auth.loginDoctor(payload).subscribe({
      next: (response: any) => {
        console.log('Login response received:', response);
        
        if (!response?.token) {
          console.error('No token in response');
          this.errorMessage = 'Login failed: No token received.';
          this.submitting = false;
          return;
        }

        console.log('Login successful, setting token and navigating');
        this.auth.setToken(response.token);
        this.auth.setRole('DOCTOR');
        this.submitting = false;
        this.router.navigate(['/doctor-page/dash']);
      },

      error: (err: any) => {
        console.error('Login error:', err);
        this.submitting = false;
        
        if (err.status === 404) {
          this.errorMessage = 'Account not found. Please register first.';
        } else if (err.status === 401) {
          this.errorMessage = 'Invalid email or password.';
        } else if (err.status === 403) {
          this.errorMessage = 'Access denied. Please ensure you are logging in as a Doctor.';
        } else if (err.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        } else {
          this.errorMessage = 'Login failed. Please try again. (Error: ' + (err.status || 'Unknown') + ')';
        }
      }
    });
  }
}
