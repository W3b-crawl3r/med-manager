import { Component, signal, WritableSignal, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('med');

  accountAction: WritableSignal<'signin' | 'inscription' | null> = signal(null);
  selectedRole: WritableSignal<string | null> = signal(null);
  registerMenuOpen: WritableSignal<boolean> = signal(false);
  signInMenuOpen: WritableSignal<boolean> = signal(false);
  registerSelected: WritableSignal<string> = signal('doctor');
  registerNotice: WritableSignal<string | null> = signal(null);

  constructor(private router: Router) {}

  setAccountAction(action: 'signin' | 'inscription' | null) {
    this.accountAction.set(action);
    this.selectedRole.set(null);
  }

  chooseRole(role: string) {
    this.selectedRole.set(role);
  }

  toggleRegisterMenu() {
    this.registerMenuOpen.update(v => !v);
    this.registerNotice.set(null);
  }

  toggleSignInMenu() {
    this.signInMenuOpen.update(v => !v);
  }

  setRegisterRole(role: string) {
    this.registerSelected.set(role);
  }

  proceedRegister() {
    const role = this.registerSelected();
    if (role === 'doctor') {
      this.setAccountAction('inscription');
      this.chooseRole('doctor');
      this.registerMenuOpen.set(false);
      return;
    }
    this.registerNotice.set('Registration for ' + role + ' is not available yet.');
  }

  onRegisterRoleClick(role: string) {
    if (role === 'doctor') {
      // navigate to the doctor inscription route
      this.registerMenuOpen.set(false);
      this.signInMenuOpen.set(false);
      this.router.navigate(['/doctor-inscription']);
      return;
    }
    if (role === 'secretaire') {
      // navigate to the secretary inscription route
      this.registerMenuOpen.set(false);
      this.signInMenuOpen.set(false);
      this.router.navigate(['/secretary-inscription']);
      return;
    }
    // for other roles, select and show notice
    this.registerSelected.set(role);
    this.registerNotice.set('Registration for ' + role + ' is not available yet.');
  }

  onSignInRoleClick(role: string) {
    if (role === 'secretaire') {
      this.signInMenuOpen.set(false);
      this.registerMenuOpen.set(false);
      this.router.navigate(['/secretary-login']);
      return;
    }
    if (role === 'doctor') {
      this.signInMenuOpen.set(false);
      this.registerMenuOpen.set(false);
      this.router.navigate(['/doctor-login']);
      return;
    }
    // other roles not yet implemented
  }

  backToStart() {
    this.setAccountAction(null);
  }

  isDoctorRoute(): boolean {
    try {
      return this.router.url.startsWith('/doctor-inscription') || 
             this.router.url.startsWith('/secretary-inscription') ||
             this.router.url.startsWith('/secretary-login');
    } catch {
      return false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Close menus if click is outside of header
    const header = document.querySelector('.app-header');
    if (header && !header.contains(target)) {
      this.registerMenuOpen.set(false);
      this.signInMenuOpen.set(false);
    }
  }
}
