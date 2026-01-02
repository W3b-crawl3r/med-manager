import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  template: `
    <h2>Login</h2>
    <button (click)="loginSecretary()">Login Secrétaire</button>
    <button (click)="loginDoctor()">Login Médecin</button>
  `
})
export class LoginComponent {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  loginSecretary() {
    this.auth.loginAsSecretary();
    this.router.navigate(['/secretary/dashboard']);
  }

  loginDoctor() {
    this.auth.loginAsDoctor();
    // redirection vers dashboard doctor
    this.router.navigate(['/doctor/dashboard']);
  }
}
