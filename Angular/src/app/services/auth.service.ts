import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = '/api/auth';

  constructor(private http: HttpClient) {}

  registerDoctor(payload: any): Observable<any> {
    // Payload may be FormData (multipart) or plain JSON depending on caller
    return this.http.post(`${this.base}/register-doctor`, payload);
  }
   private role: 'SECRETARY' | 'DOCTOR' | null = null;

  loginAsSecretary() {
    this.role = 'SECRETARY';
  }

  loginAsDoctor() {
    this.role = 'DOCTOR';
  }

  getRole() {
    return this.role;
  }

  isSecretary(): boolean {
    return this.role === 'SECRETARY';
  }
}
