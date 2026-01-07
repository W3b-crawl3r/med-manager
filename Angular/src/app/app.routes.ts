import { Routes } from '@angular/router';
import { secretaryGuard } from './Secretary/secretary.guard';
import { LoginComponent } from './components/login-component/login-component';
import { Dummy } from './components/dummy/dummy';
import { authenticatedGuard } from './guards/authenticated-guard';

export const routes: Routes = [
  // DOCTOR ROUTES
  {
    path: 'doctor-page',
    loadChildren: () => import('./doctor/doctor.module').then(m => m.DoctorRoutingModule)
  }


  ,
  // LOGIN ROUTES
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: Dummy, canActivate: [authenticatedGuard] },

  // DOCTOR & SECRETARY AND PATIENT INSCRIPTIONS
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
    path: 'patient-inscription',
    loadComponent: () =>
      import('./patient/patient-inscription/patient-inscription.component')
        .then(m => m.PatientInscriptionComponent)
  },

  // DOCTOR LOGIN
  {
    path: 'doctor-login',
    loadComponent: () =>
      import('./doctor/doctor-login/doctor-login.component')
        .then(m => m.DoctorLoginComponent)
  },

  // Booking route for patients to choose available time for a specific doctor
  {
    path: 'book/:id',
    loadComponent: () => import('./booking/booking.component').then(m => m.BookingComponent)
  },
  {
    path: 'book',
    loadComponent: () => import('./booking/booking.component').then(m => m.BookingComponent)
  },

  // SECRETARY LOGIN & DASHBOARD
  {
    path: 'secretary-login',
    loadComponent: () =>
      import('./Secretary/secretary-login/secretary-login.component')
        .then(m => m.SecretaryLoginComponent)
  },

  // ADMIN LOGIN
  {
    path: 'admin-login',
    loadComponent: () =>
      import('./admin/admin-login/admin-login.component')
        .then(m => m.AdminLoginComponent)
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
  ,
  // ADMIN ROUTES
  // ADMIN ROUTES
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }

];
