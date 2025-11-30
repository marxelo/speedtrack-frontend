import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/speedtrack.models';

// 1. AUTH GUARD: Protects against unauthenticated users
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Not logged in? Redirect to login
  router.navigate(['/login']);
  return false;
};

// 2. ROLE GUARD: Protects against unauthorized roles
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Get the allowed roles from the route configuration
  const expectedRoles = route.data['roles'] as UserRole[];

  if (authService.hasAnyRole(expectedRoles)) {
    return true;
  }

  // Logged in but wrong role? 
  alert('Acesso negado: Você não tem permissão para acessar esta página.');
  
  // Redirect to a safe page based on their actual role
  const userRole = authService.getUserRole();
  if (userRole === UserRole.COURIER) {
    router.navigate(['/app/consult']);
  } else {
    router.navigate(['/app/dashboard']);
  }
  
  return false;
};