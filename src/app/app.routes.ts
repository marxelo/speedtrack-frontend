import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterPackageComponent } from './components/register-package/register-package.component';
import { PackageDetailComponent } from './components/package-detail/package-detail.component';
import { ConsultPackagesComponent } from './components/consult-packages/consult-packages.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';

export const routes: Routes = [
  // 1. Public Area
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },

  // 2. Private Area (Authenticated)
  {
    path: 'app', // Prefix for all internal pages
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'register', component: RegisterPackageComponent },
      { path: 'consult', component: ConsultPackagesComponent },
      { path: 'users', component: ManageUsersComponent },
      { path: 'package/:id', component: PackageDetailComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Fallback
  { path: '**', redirectTo: 'dashboard' }
];