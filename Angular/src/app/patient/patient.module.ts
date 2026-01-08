import { NgModule } from '@angular/core';
import { PatientInscriptionComponent } from './patient-inscription/patient-inscription.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [RouterModule],
  exports: [],
  declarations: [] // DO NOT DECLARE standalone component here!
})
export class PatientModule {}
