import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // si tes composants utilisent des formulaires
import { AdminRoutingModule } from './admin-routing.module';

// Import des composants du module Admin




@NgModule({
  declarations: [



  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
