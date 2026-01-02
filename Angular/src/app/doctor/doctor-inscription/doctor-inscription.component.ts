import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  selector: 'app-doctor-inscription',
  templateUrl: './doctor-inscription.component.html',
  styleUrls: ['./doctor-inscription.component.css']
})
export class DoctorInscriptionComponent {
  form: FormGroup;

  submitting = false;
  successMessage = '';
  errorMessage = '';

  identityFile: File | null = null;
  certificateFile: File | null = null;
  identityPreview: string | null = null;
  certificatePreview: string | null = null;

 showLanguageMenu = false;
  userMenuOpen = false;
  currentUser = 'Doctor';
  currentLang = 'en';
  currentFlag = 'https://flagcdn.com/gb.svg';

  translations: Record<string, Record<string, string>> = {
    en: {
      title: 'Doctor Registration',
      subtitle: 'Join MedManager — secure upload of your ID & credentials',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Enter your full name',
      email: 'Email',
      emailPlaceholder: 'Enter your email',
      password: 'Password',
      passwordPlaceholder: 'Create a password',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Confirm your password',
      passwordMismatch: 'Passwords do not match.',
      specialty: 'Specialty',
      phone: 'Phone Number',
      licenseNumber: 'License Number',
      hospital: 'Hospital/Clinic',
      experience: 'Years of Experience',
      identityCard: 'Identity Card',
      certificate: 'Certificate (image / PDF)',
      terms: 'I agree to the terms and conditions.',
      register: 'Register',
      alreadyAccountPrefix: 'Already have an account?',
      loginLink: 'Login here'
    },
    fr: {
      title: 'Inscription Médecin',
      subtitle: "Rejoignez MedManager — téléversez en toute sécurité votre pièce d'identité et vos diplômes",
      fullName: 'Nom complet',
      fullNamePlaceholder: 'Entrez votre nom complet',
      email: 'E-mail',
      emailPlaceholder: 'Entrez votre e-mail',
      password: 'Mot de passe',
      passwordPlaceholder: 'Créez un mot de passe',
      confirmPassword: 'Confirmez le mot de passe',
      confirmPasswordPlaceholder: 'Confirmez votre mot de passe',
      passwordMismatch: 'Les mots de passe ne correspondent pas.',
      specialty: 'Spécialité',
      phone: 'Numéro de téléphone',
      licenseNumber: "Numéro d'autorisation",
      hospital: 'Hôpital / Clinique',
      experience: "Années d'expérience",
      identityCard: "Carte d'identité",
      certificate: 'Certificat (image / PDF)',
      terms: "J'accepte les termes et conditions.",
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
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      specialty: ['', Validators.required],
      phone: ['', Validators.required],
      licenseNumber: ['', Validators.required]
    }, { validators: DoctorInscriptionComponent.passwordsMatch });
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

  onIdentityChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) this.identityFile = input.files[0];
    if (this.identityPreview) {
      try { URL.revokeObjectURL(this.identityPreview); } catch {}
      this.identityPreview = null;
    }
    if (this.identityFile && this.identityFile.type.startsWith('image/')) {
      this.identityPreview = URL.createObjectURL(this.identityFile);
    }
  }

  onCertificateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) this.certificateFile = input.files[0];
    if (this.certificatePreview) {
      try { URL.revokeObjectURL(this.certificatePreview); } catch {}
      this.certificatePreview = null;
    }
    if (this.certificateFile && this.certificateFile.type.startsWith('image/')) {
      this.certificatePreview = URL.createObjectURL(this.certificateFile);
    }
  }

  ngOnDestroy(): void {
    if (this.identityPreview) {
      try { URL.revokeObjectURL(this.identityPreview); } catch {}
    }
    if (this.certificatePreview) {
      try { URL.revokeObjectURL(this.certificatePreview); } catch {}
    }
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

    const fd = new FormData();
    const val = this.form.value;
    fd.append('name', val.name);
    fd.append('email', val.email);
    fd.append('password', val.password);
    fd.append('specialty', val.specialty);
    fd.append('phone', val.phone);
    fd.append('licenseNumber', val.licenseNumber);
    if (this.identityFile) fd.append('identityCard', this.identityFile, this.identityFile.name);
    if (this.certificateFile) fd.append('certificate', this.certificateFile, this.certificateFile.name);

    this.submitting = true;
    this.auth.registerDoctor(fd).subscribe({
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
