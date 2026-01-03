import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Patient {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  allergies: string[];
}

@Injectable({ providedIn: 'root' })
export class PatientService {
  private base = '/api/patients';
  private patientsSubject = new BehaviorSubject<Patient[]>([]);
  patients$ = this.patientsSubject.asObservable();

  // Local mock data for development
  private mockPatients: Patient[] = [
    {
      id: 'P001',
      fullName: 'Michael Chen',
      age: 45,
      gender: 'Male',
      bloodType: 'O+',
      phone: '+1 (555) 123-4567',
      email: 'michael.chen@email.com',
      address: '123 Main St, New York, NY 10001',
      allergies: ['Penicillin', 'Peanuts']
    },
    {
      id: 'P002',
      fullName: 'Emma Rodriguez',
      age: 32,
      gender: 'Female',
      bloodType: 'A+',
      phone: '+1 (555) 234-5678',
      email: 'emma.rodriguez@email.com',
      address: '456 Oak Ave, Los Angeles, CA 90001',
      allergies: []
    },
    {
      id: 'P003',
      fullName: 'David Thompson',
      age: 58,
      gender: 'Male',
      bloodType: 'B+',
      phone: '+1 (555) 345-6789',
      email: 'david.thompson@email.com',
      address: '789 Pine Rd, Chicago, IL 60601',
      allergies: ['Aspirin']
    }
  ];

  constructor(private http: HttpClient) {
    // Initialize with mock data
    this.patientsSubject.next(this.mockPatients);
  }

  getPatients(): Observable<Patient[]> {
    // Try to fetch from backend, fallback to mock data
    return this.http.get<Patient[]>(this.base).pipe(
      error => {
        // On error, return mock data
        return this.patientsSubject.asObservable();
      }
    );
  }

  getPatientById(id: string): Observable<Patient | undefined> {
    return new Observable(subscriber => {
      const patient = this.mockPatients.find(p => p.id === id);
      subscriber.next(patient);
      subscriber.complete();
    });
  }

  addPatient(patient: Omit<Patient, 'id'>): Observable<Patient> {
    return this.http.post<Patient>(`${this.base}/add`, patient);
  }

  updatePatient(id: string, patient: Partial<Patient>): Observable<Patient> {
    return this.http.put<Patient>(`${this.base}/${id}`, patient);
  }

  deletePatient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  // Get all patients locally (mock)
  getAllPatients(): Patient[] {
    return this.mockPatients;
  }

  // Search patients by name
  searchPatients(query: string): Patient[] {
    return this.mockPatients.filter(p =>
      p.fullName.toLowerCase().includes(query.toLowerCase())
    );
  }
}
