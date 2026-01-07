import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorLayoutComponent } from './doctor-layout/doctor-layout.component';
import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard.component';
import { DoctorPatientComponent } from './doctor-patient/doctor-patient.component';
import { DoctorAppointmentComponent } from './doctor-appointments/doctor-appointment.component';
import { DoctorVisitsComponent } from './doctor-visits/doctor-visits.component';
import { DoctorProfileComponent } from './doctor-profile/doctor-profile.component';

const routes: Routes = [
  {
    path: '',
    component: DoctorLayoutComponent,
    children: [
      { path: 'dash', component: DoctorDashboardComponent },
      { path: 'patients', component: DoctorPatientComponent },
      { path: 'appointments', component: DoctorAppointmentComponent },
      { path: 'visits', component: DoctorVisitsComponent },
      { path: 'profile', component: DoctorProfileComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule {}
