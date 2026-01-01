import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'doctor-inscription',
		loadComponent: () => import('./doctor-inscription/doctor-inscription.component').then(m => m.DoctorInscriptionComponent)
	}
];
