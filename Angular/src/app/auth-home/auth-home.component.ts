import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-auth-home',
  template: `
    <div class="auth-shell">
      <div class="bg-decor"></div>

      <div class="auth-container">
        <header class="auth-header">
          <h1>MedManager</h1>
          <p>Healthcare Management Platform</p>
        </header>

        <div class="auth-options">
          <div class="option-group">
            <h3>Doctor</h3>
            <p>Register and manage your medical practice</p>
            <div class="button-group">
              <a [routerLink]="['/doctor-inscription']" class="btn btn-primary">
                Register
              </a>
            </div>
          </div>

          <div class="divider"></div>

          <div class="option-group">
            <h3>Secretary</h3>
            <p>Manage appointments and patient records</p>
            <div class="button-group">
              <a [routerLink]="['/secretary-inscription']" class="btn btn-primary">
                Register
              </a>
              <a [routerLink]="['/secretary-login']" class="btn btn-secondary">
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-shell {
      position: relative;
      min-height: 100vh;
      background: linear-gradient(135deg, #e0f7fa 0%, #b3e5fc 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    }

    .bg-decor {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.05" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,112C960,117,1056,107,1152,101.3C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') no-repeat bottom;
      background-size: cover;
      pointer-events: none;
    }

    .auth-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      max-width: 700px;
      width: 100%;
      padding: 3rem;
      position: relative;
      z-index: 5;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .auth-header h1 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem 0;
      color: #0277bd;
    }

    .auth-header p {
      color: #6b7280;
      margin: 0;
      font-size: 1rem;
    }

    .auth-options {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 2rem;
      align-items: center;
    }

    @media (max-width: 600px) {
      .auth-options {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .divider {
        height: 1px;
        background: #e0e0e0;
        width: 100%;
      }
    }

    .option-group {
      text-align: center;
    }

    .option-group h3 {
      font-size: 1.5rem;
      margin: 0 0 0.5rem 0;
      color: #111827;
    }

    .option-group p {
      color: #6b7280;
      margin: 0 0 1.5rem 0;
      font-size: 0.95rem;
    }

    .button-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #0277bd 0%, #01579b 100%);
      color: white;
    }

    .btn-primary:hover {
      box-shadow: 0 4px 12px rgba(2, 119, 189, 0.4);
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #0277bd;
      border: 1px solid #d1d5db;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
      border-color: #0277bd;
    }

    .divider {
      height: 100px;
      width: 1px;
      background: #e0e0e0;
    }

    @media (max-width: 600px) {
      .auth-container {
        padding: 2rem;
      }

      .auth-header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class AuthHomeComponent {}
