import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PackageService } from '../../services/package.service';
import { Package, PackageStatus } from '../../models/speedtrack.models';

@Component({
  selector: 'app-package-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './package-detail.component.html',
  styleUrls: ['./package-detail.component.css']
})
export class PackageDetailComponent implements OnInit {
  package: Package | null = null;
  isLoading = true;
  
  // Expose Enum to HTML
  PackageStatus = PackageStatus;

  constructor(
    private route: ActivatedRoute,
    private packageService: PackageService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Get ID from URL (e.g., /package/1 -> id = 1)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPackage(Number(id));
    }
  }

  loadPackage(id: number) {
    this.isLoading = true;
    this.packageService.getPackageById(id).subscribe({
      next: (data) => {
        this.package = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        alert('Erro ao carregar encomenda.');
        this.cdr.detectChanges();
      }
    });
  }

  goBack() {
    this.location.back();
  }

  // --- Actions Logic ---

  changeStatus(newStatus: PackageStatus) {
    if (!this.package) return;

    let notes = '';
    let courierName = '';

    // Simple interaction logic (replacing Modals for simplicity)
    if (newStatus === PackageStatus.WAITING_WITHDRAWAL) {
      // Assigning a courier
      const input = prompt("Digite o nome do Entregador:");
      if (!input) return; // Cancelled
      courierName = input;
    } else if (newStatus === PackageStatus.RETURNED_WAREHOUSE) {
       notes = prompt("Motivo da devolução:") || 'Devolvido';
    }

    if (confirm('Tem certeza que deseja alterar o status?')) {
      this.packageService.updateStatus(this.package.id, newStatus, notes, courierName)
        .subscribe({
          next: (updatedPackage) => {
            this.package = updatedPackage; // Update view instantly
            alert('Status atualizado com sucesso!');
          },
          error: (err) => alert('Erro ao atualizar status.')
        });
    }
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