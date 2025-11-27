import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ActivatedRoute } from '@angular/router';
import { PackageService } from '../../services/package.service';
import { Package, PackageStatus, User } from '../../models/speedtrack.models';

@Component({
  selector: 'app-package-detail',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './package-detail.component.html',
  styleUrls: ['./package-detail.component.css']
})
export class PackageDetailComponent implements OnInit {
  package: Package | null = null;
  couriers: User[] = [];
  isLoading = true;
  
  // Modal State
  isAssignModalOpen = false;
  selectedCourierId: number | null = null;

  PackageStatus = PackageStatus;

  constructor(
    private route: ActivatedRoute,
    private packageService: PackageService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPackage(Number(id));
    }
    this.loadCouriers();
  }

  loadPackage(id: number) {
    this.isLoading = true;
    this.packageService.getPackageById(id).subscribe({
      next: (data) => {
        this.package = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => { console.error(err); this.isLoading = false; }
    });
  }

  loadCouriers() {
    this.packageService.getCouriers().subscribe(data => {
      this.couriers = data;
    });
  }

  // --- Modal Logic ---
  openAssignModal() {
    this.isAssignModalOpen = true;
  }

  closeAssignModal() {
    this.isAssignModalOpen = false;
    this.selectedCourierId = null;
  }

  confirmAssignment() {
    if (!this.selectedCourierId || !this.package) return;

    this.packageService.updateStatus(
      this.package.id, 
      PackageStatus.WAITING_WITHDRAWAL, 
      undefined, 
      this.selectedCourierId
    ).subscribe({
      next: (updatedPackage) => {
        this.package = updatedPackage;
        this.closeAssignModal();
        alert('Entregador atribuído com sucesso!');
        this.cdr.detectChanges();
      },
      error: () => alert('Erro ao atribuir entregador')
    });
  }

  // --- Other Actions ---
  changeStatus(newStatus: PackageStatus) {
    if (!this.package) return;
    
    // For other statuses (Delivery, Return, etc.)
    let notes = '';
    if (newStatus === PackageStatus.RETURNED_WAREHOUSE) {
       notes = prompt("Motivo da devolução:") || 'Devolvido';
    }

    if (confirm('Confirmar alteração de status?')) {
      this.packageService.updateStatus(this.package.id, newStatus, notes)
        .subscribe({
          next: (updated) => {
            this.package = updated;
            this.cdr.detectChanges();
          }
        });
    }
  }
  goBack() {
    this.location.back();
  }

  // ... helpers (getStatusClass, formatStatus) ...
  getStatusClass(status: string): string {
    switch (status) {
      case PackageStatus.WAITING_ASSIGNMENT:
      case PackageStatus.WAITING_WITHDRAWAL: return 'status-waiting';
      case PackageStatus.WITH_COURIER:
      case PackageStatus.OUT_FOR_DELIVERY: return 'status-in-transit';
      case PackageStatus.DELIVERED: return 'status-delivered';
      case PackageStatus.RETURNED_WAREHOUSE: return 'status-returned';
      case PackageStatus.RETURN_TO_WHAREHOUSE_PENDING: return 'status-returned';
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
      'RETURNED_WAREHOUSE': 'Devolvida ao Armazém',
      'RETURN_TO_WHAREHOUSE_PENDING': 'Devolução ao Armazém Pendente'
    };
    return map[status] || status;
  }
}