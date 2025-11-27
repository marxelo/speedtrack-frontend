import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PackageService } from '../../services/package.service';
import { DashboardStats, Package, PackageStatus } from '../../models/speedtrack.models';
import { map, Observable } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats$!: Observable<DashboardStats>;
  recentPackages$!: Observable<Package[]>;

  constructor(private packageService: PackageService) {}

  ngOnInit(): void {
    // We just assign the stream, we don't subscribe manually
    this.stats$ = this.packageService.getDashboardStats();
    
    // For sorting, we can pipe the result
    this.recentPackages$ = this.packageService.getPackages().pipe(
      map(packages => packages
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
      )
    );
  }

  // loadDashboardData() {
  //   this.isLoading = true;
    
  //   // 1. Fetch Stats (KPIs)
  //   this.packageService.getDashboardStats().subscribe({
  //     next: (data) => this.stats = data,
  //     error: (err) => console.error('Error loading stats', err)
  //   });

  //   // 2. Fetch Packages for the Table
  //   // In a real app, you would ask the backend for "top 5 sorted by date"
  //   // Here we fetch all and sort in the frontend for simplicity
  //   this.packageService.getPackages().subscribe({
  //     next: (data) => {
  //       // Sort by ID descending (proxy for "most recent") or use createdAt date
  //       this.recentPackages = data
  //         .sort((a, b) => (b.id || 0) - (a.id || 0))
  //         .slice(0, 5); // Take top 5
  //       this.isLoading = false;
  //     },
  //     error: (err) => console.error('Error loading packages', err)
  //   });
  // }

  // Helper to determine badge color class
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
      case PackageStatus.RETURNED_SENDER:
        return 'status-returned';
      default:
        return '';
    }
  }

  // Helper to make enum text user-friendly
  formatStatus(status: string): string {
    // Basic mapping, you could use a pipe for this later
    const map: any = {
      'WAITING_ASSIGNMENT': 'Aguardando Atribuição',
      'WAITING_WITHDRAWAL': 'Aguardando Retirada',
      'WITH_COURIER': 'Com Entregador',
      'OUT_FOR_DELIVERY': 'Saiu para Entrega',
      'DELIVERED': 'Entregue',
      'RETURNED_WAREHOUSE': 'Devolvida (Armazém)'
    };
    return map[status] || status;
  }
}