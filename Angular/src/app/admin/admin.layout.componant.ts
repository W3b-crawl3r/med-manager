import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="admin-layout">
      <!-- SIDEBAR / HEADER ADMIN (optionnel) -->
      <router-outlet></router-outlet>
    </div>
  `
})
export class AdminLayoutComponent { }
