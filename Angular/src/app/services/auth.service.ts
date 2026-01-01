import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = '/api/auth';

  constructor(private http: HttpClient) {}

  registerDoctor(payload: any): Observable<any> {
    return this.http.post(`${this.base}/register-doctor`, payload);
  }
}
