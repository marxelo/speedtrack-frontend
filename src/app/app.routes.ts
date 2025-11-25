import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { RegisterPackageComponent } from './components/register-package/register-package.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';

// Guard placeholder (we will implement real security later)
// const authGuard = () => inject(AuthService).isAuthenticated();

export const routes: Routes = [
  // 1. Public Routes
  { 
    path: 'login', 
    component: LoginComponent 
  },

  // 2. Secured Routes (Wrapped in MainLayout)
  {
    path: '',
    component: MainLayoutComponent,
    // canActivate: [authGuard], // Enable later
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'register', component: RegisterPackageComponent },
      // Redirect empty path to dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // 3. Fallback
  { path: '**', redirectTo: 'login' }
];