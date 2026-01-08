import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginReply } from '../dto/login-reply';
import { LoginRequest } from '../dto/login-request';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly TOKEN_KEY = 'token';

  login(data: LoginRequest, onUnauthorized: () => void): void {
    
    this.http.post<LoginReply>(environment.LOGIN, data).subscribe({
      next: (response) => {
        // Persist token in session storage for page refreshes
        try {
          sessionStorage.setItem(this.TOKEN_KEY, response.token);
        } catch {}
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        if (error.status === 403) {
          onUnauthorized();
        }
      },
    });
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string {
        return  sessionStorage.getItem(this.TOKEN_KEY)||'';
  }

    logout() {
      sessionStorage.removeItem(this.TOKEN_KEY);
      this.router.navigate(['/login']);
  }
  
  test(): void {
    this.http.get(environment.TEST_AUTH, { responseType: 'text' }).subscribe({
      next: (value) => {
        console.log('Test endpoint response:', value);
      },
      error: (err) => {
        console.error('Test endpoint error:', err);
      },
    });
  }
}