import { Routes } from '@angular/router';
import { secretaryGuard } from './Secretary/secretary.guard';
import { LoginComponent } from './components/login-component/login-component';
import { Dummy } from './components/dummy/dummy';
import { authenticatedGuard } from './guards/authenticated-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: Dummy, canActivate: [authenticatedGuard] },

  {
    path: 'doctor-inscription',
    loadComponent: () =>
      import('./doctor/doctor-inscription/doctor-inscription.component')
      .then(m => m.DoctorInscriptionComponent)
  },

  {
    path: 'secretary-inscription',
    loadComponent: () =>
      import('./Secretary/secretary-inscription/secretary-inscription.component')
      .then(m => m.SecretaryInscriptionComponent)
  },

  {
    path: 'secretary-login',
    loadComponent: () =>
      import('./Secretary/secretary-login/secretary-login.component')
      .then(m => m.SecretaryLoginComponent)
  },

  {
    path: 'secretary/dashboard',
    loadComponent: () =>
      import('./Secretary/dashboard-doctor.component')
      .then(m => m.DashboardDoctorComponent),
    canActivate: [secretaryGuard]
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
