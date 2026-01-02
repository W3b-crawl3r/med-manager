import { Routes } from '@angular/router';
import { secretaryGuard } from './Secretary/secretary.guard';
export const routes: Routes = [

  {
    path: 'doctor-inscription',
    loadComponent: () =>
      import('./doctor-inscription/doctor-inscription.component')
      .then(m => m.DoctorInscriptionComponent)
  },

   {
    path: 'secretary/dashboard',
    loadComponent: () =>
      import('./Secretary/dashboard-doctor.component')
      .then(m => m.DashboardDoctorComponent),
    canActivate: [secretaryGuard] // 🔐 PROTECTION
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component')
      .then(m => m.LoginComponent)
  },

  {
    path: 'secretary/appointments',
    loadComponent: () =>
      import('./Secretary/appointments/appointments.component')
      .then(m => m.AppointmentsComponent),
    canActivate: [secretaryGuard]
  },

  {
    path: 'patient-detail/:id',
    loadComponent: () =>
      import('./Secretary/patient-detail/patient-detail.component')
      .then(m => m.PatientDetailComponent),
    canActivate: [secretaryGuard]
  },

  {
    path: 'patients',
    loadComponent: () =>
      import('./Secretary/patients-list/patients-list.component')
      .then(m => m.PatientsListComponent),
    canActivate: [secretaryGuard]
  }
];
