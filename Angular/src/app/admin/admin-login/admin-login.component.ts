import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  form: FormGroup;
  submitting = false;
  errorMessage = '';
  private DEMO_EMAIL = 'admin@medmanager.com';
  private DEMO_PASSWORD = 'admin123';
  showLanguageMenu = false;
  currentLang = 'en';
  currentFlag = 'https://flagcdn.com/gb.svg';

  translations: Record<string, Record<string, string>> = {
    en: {
      title: 'Admin Login',
      subtitle: 'Access your MedManager admin panel',
      email: 'Email',
      emailPlaceholder: 'Enter your email',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      login: 'Login',
      loggingIn: 'Logging in...',
      noAccount: "Don't have an account?",
      registerLink: 'Contact system administrator',
      backToHome: 'Back to home'
    },
    fr: {
      title: 'Connexion Admin',
      subtitle: 'Accédez à votre panneau d\'administration MedManager',
      email: 'E-mail',
      emailPlaceholder: 'Entrez votre e-mail',
      password: 'Mot de passe',
      passwordPlaceholder: 'Entrez votre mot de passe',
      login: 'Se connecter',
      loggingIn: 'Connexion...',
      noAccount: "Vous n'avez pas de compte ?",
      registerLink: 'Contactez l\'administrateur système',
      backToHome: "Retour à l'accueil"
    }
  };

  t(key: string) {
    return this.translations[this.currentLang]?.[key] ?? key;
  }
  
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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

  goBack() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value;
    this.submitting = true;
    this.errorMessage = '';

    // Demo login
    if (payload.email === this.DEMO_EMAIL && payload.password === this.DEMO_PASSWORD) {
      this.auth.setToken('demo-admin-token');
      this.auth.setRole('ADMIN');
      this.submitting = false;
      this.router.navigate(['/admin']);
      return;
    }

    // Real login
    this.auth.loginAdmin(payload).subscribe({
      next: (response: any) => {
        const token = response.token || 'admin-token-placeholder';
        this.auth.setToken(token);
        this.auth.setRole('ADMIN');
        this.submitting = false;
        this.router.navigate(['/admin']);
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.errorMessage = 'Account not found. Please contact system administrator.';
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

