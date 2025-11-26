import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PackageService } from '../../services/package.service';
import { Package, PackageStatus, User } from '../../models/speedtrack.models';

@Component({
  selector: 'app-consult-packages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './consult-packages.component.html',
  styleUrls: ['./consult-packages.component.css']
})
export class ConsultPackagesComponent implements OnInit {
  filterForm: FormGroup;
  packages: Package[] = [];
  couriers: User[] = [];
  
  // Expose Enum to HTML
  PackageStatus = PackageStatus;
  statusOptions = Object.values(PackageStatus);

  constructor(
    private fb: FormBuilder,
    private packageService: PackageService
  ) {
    this.filterForm = this.fb.group({
      status: [''],
      partner: [''],
      courierId: ['']
    });
  }

  ngOnInit(): void {
    this.loadPackages();
    this.loadCouriers();
  }

  loadPackages() {
    // Convert empty strings to undefined to avoid sending empty params
    const filters = this.filterForm.value;
    const cleanFilters: any = {};
    
    if (filters.status) cleanFilters.status = filters.status;
    if (filters.partner) cleanFilters.partner = filters.partner;
    if (filters.courierId) cleanFilters.courierId = filters.courierId;

    this.packageService.getPackages(cleanFilters).subscribe({
      next: (data) => this.packages = data,
      error: (err) => console.error(err)
    });
  }

  loadCouriers() {
    this.packageService.getCouriers().subscribe({
      next: (data) => this.couriers = data,
      error: (err) => console.error(err)
    });
  }

  clearFilters() {
    this.filterForm.reset({ status: '', partner: '', courierId: '' });
    this.loadPackages();
  }

  // --- Helpers ---
  getStatusClass(status: string): string {
    switch (status) {
      case PackageStatus.WAITING_ASSIGNMENT:
      case PackageStatus.WAITING_WITHDRAWAL:
        return 'status-waiting';
      case PackageStatus.WITH_COURIER:
      case PackageStatus.OUT_FOR_DELIVERY:
        return 'status-in-transit';
      case PackageStatus.DELIVERED:
        return 'status-delivered';
      case PackageStatus.RETURNED_WAREHOUSE:
        return 'status-returned';
      default: return '';
    }
  }

  formatStatus(status: string): string {
    const map: any = {
      'WAITING_ASSIGNMENT': 'Aguardando Atribuição',
      'WAITING_WITHDRAWAL': 'Aguardando Retirada',
      'WITH_COURIER': 'Com Entregador',
      'OUT_FOR_DELIVERY': 'Saiu para Entrega',
      'DELIVERED': 'Entregue',
      'RETURNED_WAREHOUSE': 'Devolvida ao Armazém'
    };
    return map[status] || status;
  }
}