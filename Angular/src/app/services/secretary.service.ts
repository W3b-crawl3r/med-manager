import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SecretaryAppointment {
  id: number;
  patientId: number;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: string;
}

export interface SecretaryDashboardDto {
  totalPatients: number;
  appointmentsOnDate: number;
  pendingVisits: number;
  activePatients: number;
  appointments: SecretaryAppointment[];
}

@Injectable({ providedIn: 'root' })
export class SecretaryService {
  constructor(private http: HttpClient) {}

  getDashboard(username: string, date?: string): Observable<SecretaryDashboardDto> {
    let url = `/api/v1/secretaries/${encodeURIComponent(username)}/dashboard`;
    if (date) {
      url += `?date=${encodeURIComponent(date)}`;
    }
    return this.http.get<SecretaryDashboardDto>(url);
  }

  getPatients(username: string): Observable<Array<{ id: number; username: string; visits: Array<{ id: number; summary: string; visitDate: string }> }>> {
    return this.http.get<Array<{ id: number; username: string; visits: Array<{ id: number; summary: string; visitDate: string }> }>>(
      `/api/v1/secretaries/${encodeURIComponent(username)}/patients`
    );
  }
}
