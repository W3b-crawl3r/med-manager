import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface DoctorSearchResult {
  id: number;
  username: string;
  specialty: string;
  location: string;
  clinic: string;
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private base = '/api/v1/search';

  constructor(private http: HttpClient) {}

  searchDoctors(keyword: string): Observable<DoctorSearchResult[]> {
    const sanitized = (keyword || '').trim();
    const encoded = encodeURIComponent(sanitized);
    return this.http
      .get<DoctorSearchResult[]>(`${this.base}/doctor/${encoded}`)
      .pipe(
        catchError(err => {
          console.error('Doctor search failed', err);
          return of([]);
        })
      );
  }

  getAllDoctors(): Observable<DoctorSearchResult[]> {
    return this.http
      .get<DoctorSearchResult[]>(`${this.base}/doctor/all`)
      .pipe(
        catchError(err => {
          console.error('Fetch all doctors failed', err);
          return of([]);
        })
      );
  }
}
