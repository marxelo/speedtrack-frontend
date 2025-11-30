import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterPackageComponent } from './components/register-package/register-package.component';
import { PackageDetailComponent } from './components/package-detail/package-detail.component';
import { ConsultPackagesComponent } from './components/consult-packages/consult-packages.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { UserRole } from './models/speedtrack.models'; // Import Enum
import { authGuard, roleGuard } from './guards/auth.guard'; // Import Guards
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
  // 1. Public Area
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'not-found', component: PageNotFoundComponent },

  // 2. Private Area (Authenticated)
  {
    path: 'app', // Prefix for all internal pages
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [roleGuard], data: { roles: [UserRole.ADMIN, UserRole.OPERATOR] } },
      { path: 'register', component: RegisterPackageComponent, canActivate: [roleGuard], data: { roles: [UserRole.ADMIN, UserRole.OPERATOR] } },
      { path: 'consult', component: ConsultPackagesComponent, canActivate: [roleGuard], data: { roles: [UserRole.OPERATOR, UserRole.COURIER, UserRole.ADMIN] } },
      { path: 'users', component: ManageUsersComponent, canActivate: [roleGuard], data: { roles: [UserRole.ADMIN] } },
      { path: 'package/:id', component: PackageDetailComponent,  },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Fallback
  { path: '**', redirectTo: 'not-found' }
];