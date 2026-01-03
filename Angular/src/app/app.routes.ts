import { Routes } from '@angular/router';

export const routes: Routes = [
{
  path: 'doctor-dashboard',
  loadComponent: () =>
    import('./doctor/doctor-dashboard/doctor-dashboard.component')
      .then(m => m.DoctorDashboardComponent),
  children: [
    {
      path: '', // default dashboard view
      loadComponent: () =>
        import('./doctor/doctor-home/doctor-home.component')
          .then(m => m.DoctorHomeComponent)
    },
    {
      path: 'patients',
      loadComponent: () =>
        import('./doctor/doctor-patient/doctor-patient.component')
          .then(m => m.DoctorPatientComponent)
    },
    {
      path: 'appointments',
      loadComponent: () =>
        import('./doctor/doctor-appointments/doctor-appointment.component')
          .then(m => m.DoctorAppointmentComponent)
    },
    {
      path: 'visits',
      loadComponent: () =>
        import('./doctor/doctor-visits/doctor-visits.component')
          .then(m => m.DoctorVisitsComponent)
    }
  ]
}


];
