import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PackageService } from '../../services/package.service';
import { AuthService } from '../../services/auth.service'; // Import Auth
import { Package, PackageStatus, User, UserRole } from '../../models/speedtrack.models';
import { STATUS_LABELS } from '../../utils/package-status.utils'; // Import Map
import { StatusNamePipe, StatusClassPipe } from '../../pipes/status.pipes'; // Import Pipes

@Component({
  selector: 'app-consult-packages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, StatusNamePipe, StatusClassPipe],
  templateUrl: './consult-packages.component.html',
  styleUrls: ['./consult-packages.component.css'],
})
export class ConsultPackagesComponent implements OnInit {
  filterForm: FormGroup;
  packages: Package[] = [];
  couriers: User[] = [];

  // Role Logic
  currentUser: any = null;
  isCourier = false;

  PackageStatus = PackageStatus;
  statusLabels = STATUS_LABELS;
  statusOptions = Object.values(PackageStatus) as PackageStatus[];

  constructor(
    private fb: FormBuilder,
    private packageService: PackageService,
    private authService: AuthService, // Inject Auth
    private cdr: ChangeDetectorRef
  ) {
    this.filterForm = this.fb.group({
      status: [''],
      partner: [''],
      courierId: [''],
      startDate: [''], // New Field
      endDate: [''], // New Field
    });
  }

  ngOnInit(): void {
    // 1. Get User Info
    const role = this.authService.getUserRole();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.isCourier = role === UserRole.COURIER;

    // 2. If Courier, pre-set the filter (Optional, but good for state)
    // We don't disable the control, we just hide it in HTML and enforce in loadPackages()

    this.loadPackages();

    // Only load courier list if user is NOT a courier (to populate dropdown)
    if (!this.isCourier) {
      this.loadCouriers();
    }
  }

  loadPackages() {
    const filters = this.filterForm.value;
    const cleanFilters: any = {};

    // Standard Filters
    if (filters.status) cleanFilters.status = filters.status;
    if (filters.partner) cleanFilters.partner = filters.partner;
    if (filters.startDate) cleanFilters.startDate = filters.startDate;
    if (filters.endDate) cleanFilters.endDate = filters.endDate;

    // --- COURIER RESTRICTION LOGIC ---
    if (this.isCourier) {
      // Force their own ID
      cleanFilters.courierId = this.currentUser.id;
    } else if (filters.courierId) {
      // Admin/Operator can choose
      cleanFilters.courierId = filters.courierId;
    }

    this.packageService.getPackages(cleanFilters).subscribe({
      next: (data) => {
        this.packages = data;
        this.cdr.detectChanges(); // <--- 3. FORCE UPDATE HERE
      },
      error: (err) => console.error(err),
    });
  }

  loadCouriers() {
    this.packageService.getCouriers().subscribe((data) => (this.couriers = data));
  }

  clearFilters() {
    this.filterForm.reset({ status: '', partner: '', courierId: '', startDate: '', endDate: '' });
    this.loadPackages();
  }

}
