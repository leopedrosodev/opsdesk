import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { TicketsPageComponent } from './features/tickets/tickets-page.component';
import { AssetsPageComponent } from './features/assets/assets-page.component';
import { RunbooksPageComponent } from './features/runbooks/runbooks-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tickets', component: TicketsPageComponent, canActivate: [authGuard] },
  { path: 'assets', component: AssetsPageComponent, canActivate: [authGuard] },
  { path: 'runbooks', component: RunbooksPageComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
