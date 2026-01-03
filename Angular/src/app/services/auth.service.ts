import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = '/api/auth';
  logout: any;
  private role: 'SECRETARY' | 'DOCTOR' | null = null;
  private token: string | null = null;

  constructor(private http: HttpClient) {
    // Load token and role from localStorage on service init
    const savedToken = localStorage.getItem('authToken');
    const savedRole = localStorage.getItem('userRole');
    if (savedToken && savedRole) {
      this.token = savedToken;
      this.role = savedRole as 'SECRETARY' | 'DOCTOR';
    }
  }

  registerDoctor(payload: any): Observable<any> {
    // Payload may be FormData (multipart) or plain JSON depending on caller
    return this.http.post(`${this.base}/register-doctor`, payload);
  }

  registerSecretary(payload: any): Observable<any> {
    return this.http.post(`${this.base}/register-secretary`, payload);
  }

  loginSecretary(payload: any): Observable<any> {
    return this.http.post(`${this.base}/login-secretary`, payload);
  }

  loginDoctor(payload: any): Observable<any> {
    return this.http.post(`${this.base}/login-doctor`, payload);
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return this.token;
  }

  setRole(role: 'SECRETARY' | 'DOCTOR') {
    this.role = role;
    localStorage.setItem('userRole', role);
  }

  getRole() {
    return this.role;
  }

  isSecretary(): boolean {
    return this.role === 'SECRETARY';
  }

  isDoctor(): boolean {
    return this.role === 'DOCTOR';
  }

  logout() {
    this.token = null;
    this.role = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  }
}
