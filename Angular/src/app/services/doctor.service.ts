import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AppointmentSummaryDto {
  name: string;
  initial: string;
  reason: string;
  time: string;
  status: 'Scheduled' | 'Confirmed' | 'Cancelled';
}

export interface DoctorDashboardDto {
  totalPatients: number;
  todaysAppointments: number;
  pendingVisits: number;
  activePatients: number;
  appointments: AppointmentSummaryDto[];
}

export interface AppointmentDto {
  id: number;
  patientId: number;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class DoctorService {
  constructor(private http: HttpClient) {}

  getDashboard(username: string): Observable<DoctorDashboardDto> {
    return this.http.get<DoctorDashboardDto>(`/api/v1/doctors/${encodeURIComponent(username)}/dashboard`);
  }

  getPatients(username: string): Observable<Array<{ id: number; username: string; visits: Array<{ id: number; summary: string; visitDate: string }> }>> {
    return this.http.get<Array<{ id: number; username: string; visits: Array<{ id: number; summary: string; visitDate: string }> }>>(
      `/api/v1/doctors/${encodeURIComponent(username)}/patients`
    );
  }

  getAppointments(username: string): Observable<AppointmentDto[]> {
    return this.http.get<AppointmentDto[]>(`/api/v1/doctors/${encodeURIComponent(username)}/appointments`);
  }
}
