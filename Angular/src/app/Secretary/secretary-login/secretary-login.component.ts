import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  selector: 'app-secretary-login',
  templateUrl: './secretary-login.component.html',
  styleUrls: ['./secretary-login.component.css']
})
export class SecretaryLoginComponent {
  form: FormGroup;
  submitting = false;
  errorMessage = '';

  // DEMO CREDENTIALS (frontend-only testing)
  private DEMO_EMAIL = 'secretary@medmanager.com';
  private DEMO_PASSWORD = 'secretary123';

  showLanguageMenu = false;
  currentLang = 'en';
  currentFlag = 'https://flagcdn.com/gb.svg';

  translations: Record<string, Record<string, string>> = {
    en: {
      title: 'Secretary Login',
      subtitle: 'Access your MedManager account',
      email: 'Email',
      emailPlaceholder: 'Enter your email',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      login: 'Login',
      noAccount: "Don't have an account?",
      registerLink: 'Register here',
      backToHome: 'Back to home'
    },
    fr: {
      title: 'Connexion Secrétaire',
      subtitle: 'Accédez à votre compte MedManager',
      email: 'E-mail',
      emailPlaceholder: 'Entrez votre e-mail',
      password: 'Mot de passe',
      passwordPlaceholder: 'Entrez votre mot de passe',
      login: 'Se connecter',
      noAccount: "Vous n'avez pas de compte ?",
      registerLink: 'Inscrivez-vous',
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
    if (payload.email === this.DEMO_EMAIL && payload.password === this.DEMO_PASSWORD) {
      // simulate successful login
      this.auth.setToken('demo-secretary-token');
      this.auth.setRole('SECRETARY');
      this.submitting = false;
      this.router.navigate(['/secretary/dashboard']);
      return;
    }
    this.auth.loginSecretary(payload).subscribe({
      next: (response: any) => {
        // Assuming the response contains a token
        const token = response.token || 'secretary-token-placeholder';
        this.auth.setToken(token);
        this.auth.setRole('SECRETARY');
        this.submitting = false;
        this.router.navigate(['/secretary/dashboard']);
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
