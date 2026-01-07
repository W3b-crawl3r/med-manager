import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = '/api/auth';
  private role: 'SECRETARY' | 'DOCTOR' | 'PATIENT' | 'ADMIN' | null = null;
  private token: string | null = null;

  constructor(private http: HttpClient) {
    // Load token and role from localStorage on service init
    const savedToken = localStorage.getItem('authToken');
    const savedRole = localStorage.getItem('userRole');
    if (savedToken && savedRole) {
      this.token = savedToken;
      this.role = savedRole as 'SECRETARY' | 'DOCTOR' | 'PATIENT' | 'ADMIN';
    }
  }
  // In auth.service.ts
  registerPatient(data: FormData) {
    // Replace the URL with your backend endpoint for patient registration
    return this.http.post('/api/patients/register', data);
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

  loginPatient(payload: any): Observable<any> {
    return this.http.post(`${this.base}/login-patient`, payload);
  }

  loginAdmin(payload: any): Observable<any> {
    return this.http.post(`${this.base}/login-admin`, payload);
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return this.token;
  }

  setRole(role: 'SECRETARY' | 'DOCTOR' | 'PATIENT' | 'ADMIN') {
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

  isPatient(): boolean {
    return this.role === 'PATIENT';
  }

  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  logout() {
    this.token = null;
    this.role = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  }
}
