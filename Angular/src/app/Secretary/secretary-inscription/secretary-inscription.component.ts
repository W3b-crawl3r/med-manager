import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  selector: 'app-secretary-inscription',
  templateUrl: './secretary-inscription.component.html',
  styleUrls: ['./secretary-inscription.component.css']
})
export class SecretaryInscriptionComponent {
  form: FormGroup;

  submitting = false;
  successMessage = '';
  errorMessage = '';

  showLanguageMenu = false;
  userMenuOpen = false;
  currentUser = 'Secretaire';
  currentLang = 'en';
  currentFlag = 'https://flagcdn.com/gb.svg';

  translations: Record<string, Record<string, string>> = {
    en: {
      title: 'Secretary Registration',
      subtitle: 'Join MedManager — manage appointments and patient records securely',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Enter your full name',
      email: 'Email',
      emailPlaceholder: 'Enter your email',
      password: 'Password',
      passwordPlaceholder: 'Create a password',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Confirm your password',
      passwordMismatch: 'Passwords do not match.',
      phone: 'Phone Number',
      hospital: 'Hospital/Clinic',
      department: 'Department',
      terms: 'I agree to the terms and conditions.',
      register: 'Register',
      alreadyAccountPrefix: 'Already have an account?',
      loginLink: 'Login here',
      backToHome: 'Back to home'
    },
    fr: {
      title: 'Inscription Secrétaire',
      subtitle: 'Rejoignez MedManager — gérez les rendez-vous et les dossiers patients en toute sécurité',
      fullName: 'Nom complet',
      fullNamePlaceholder: 'Entrez votre nom complet',
      email: 'E-mail',
      emailPlaceholder: 'Entrez votre e-mail',
      password: 'Mot de passe',
      passwordPlaceholder: 'Créez un mot de passe',
      confirmPassword: 'Confirmez le mot de passe',
      confirmPasswordPlaceholder: 'Confirmez votre mot de passe',
      passwordMismatch: 'Les mots de passe ne correspondent pas.',
      phone: 'Numéro de téléphone',
      hospital: 'Hôpital / Clinique',
      department: 'Département',
      terms: "J'accepte les termes et conditions.",
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
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      phone: ['', Validators.required],
      hospital: [''],
      department: ['']
    }, { validators: SecretaryInscriptionComponent.passwordsMatch });
  }

  toggleLanguageMenu() {
    this.showLanguageMenu = !this.showLanguageMenu;
  }

  changeLanguage(lang: string) {
    this.currentLang = lang;
    this.currentFlag = lang === 'fr' ? 'https://flagcdn.com/fr.svg' : 'https://flagcdn.com/gb.svg';
    this.showLanguageMenu = false;
  }

  static passwordsMatch(group: AbstractControl | FormGroup | null) {
    if (!group) return null;
    const pw = group.get('password')?.value;
    const cpw = group.get('confirmPassword')?.value;
    return pw === cpw ? null : { passwordMismatch: true };
  }

  selectUser(user: string) {
    this.currentUser = user;
    this.userMenuOpen = false;
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
    this.auth.registerSecretary(payload).subscribe({
      next: (response: any) => {
        // Set token and role upon successful registration
        const token = response.token || 'secretary-token-placeholder';
        this.auth.setToken(token);
        this.auth.setRole('SECRETARY');
        this.successMessage = 'Registration successful';
        this.submitting = false;
        this.router.navigate(['/secretary/dashboard']);
      },
      error: () => {
        this.errorMessage = 'Registration failed. Please try again.';
        this.submitting = false;
      }
    });
  }
}
