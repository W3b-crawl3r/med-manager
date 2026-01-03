import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = '/api/auth';
  logout: any;

  constructor(private http: HttpClient) {}

  registerDoctor(payload: any): Observable<any> {
    // Payload may be FormData (multipart) or plain JSON depending on caller
    return this.http.post(`${this.base}/register-doctor`, payload);
  }
}
