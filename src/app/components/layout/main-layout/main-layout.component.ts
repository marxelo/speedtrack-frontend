import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../models/speedtrack.models';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent implements OnInit {
  isSidebarOpen = false;
  isUserMenuOpen = false;

  // Role Flags
  isAdmin = false;
  isOperator = false;
  isCourier = false;

  currentUser: any = null;

  getRoleLabel(role: string): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrador';
      case UserRole.OPERATOR:
        return 'Operador de Logística';
      case UserRole.COURIER:
        return 'Entregador';
      default:
        return role; // Fallback to the original code if unknown
    }
  }

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Determine roles based on Auth Service
    const role = this.authService.getUserRole();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    this.isAdmin = role === UserRole.ADMIN;
    this.isOperator = role === UserRole.OPERATOR;
    this.isCourier = role === UserRole.COURIER;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']); // Redirect to Landing Page
  }
}
