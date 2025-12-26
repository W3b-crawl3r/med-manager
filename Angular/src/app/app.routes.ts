import { Routes } from '@angular/router';
import { LoginComponent } from './components/login-component/login-component';
import { Dummy } from './components/dummy/dummy';
import { authenticatedGuard } from './guards/authenticated-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: Dummy, canActivate: [authenticatedGuard] },
];
