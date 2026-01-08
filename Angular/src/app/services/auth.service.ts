import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = '/api/v1/auth';
  private role: 'SECRETARY' | 'DOCTOR' | 'PATIENT' | null = null;
  private token: string | null = null;
  private username: string | null = null;

  constructor(private http: HttpClient) {
    // Load token, role and username from localStorage on service init
    const savedToken = localStorage.getItem('authToken');
    const savedRole = localStorage.getItem('userRole');
    const savedUsername = localStorage.getItem('username');
    if (savedToken) {
      this.token = savedToken;
    }
    if (savedRole) {
      this.role = savedRole as 'SECRETARY' | 'DOCTOR' | 'PATIENT';
    }
    if (savedUsername) {
      this.username = savedUsername;
    }
  }
  // In auth.service.ts
registerPatient(data: FormData) {
  // Replace the URL with your backend endpoint for patient registration
  return this.http.post('/api/patients/register', data);
}

  registerDoctor(payload: any): Observable<any> {
    // Payload may be FormData (multipart) or plain JSON depending on caller
    return this.http.post('/api/v1/doctors/signup', payload);
  }

  registerSecretary(payload: any): Observable<any> {
    return this.http.post(`${this.base}/register-secretary`, payload);
  }

  loginSecretary(payload: any): Observable<any> {
    return this.http.post(`${this.base}/login-secretary`, this.toLoginPayload(payload));
  }

  loginDoctor(payload: any): Observable<any> {
    return this.http.post(`${this.base}/login-doctor`, this.toLoginPayload(payload));
  }

  loginPatient(payload: any): Observable<any> {
    return this.http.post(`${this.base}/login-patient`, this.toLoginPayload(payload));
  }

  private toLoginPayload(payload: any) {
    return {
      username: payload?.email ?? payload?.username ?? '',
      password: payload?.password ?? ''
    };
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return this.token;
  }

  setRole(role: 'SECRETARY' | 'DOCTOR' | 'PATIENT') {
    this.role = role;
    localStorage.setItem('userRole', role);
  }

  setUsername(username: string) {
    this.username = username;
    localStorage.setItem('username', username);
  }

  getUsername(): string | null {
    return this.username;
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

  logout() {
    this.token = null;
    this.role = null;
    this.username = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
  }
}
