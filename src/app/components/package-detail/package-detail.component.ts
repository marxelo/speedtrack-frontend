import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PackageService } from '../../services/package.service';
import { Package, PackageStatus, User } from '../../models/speedtrack.models';
import { StatusNamePipe, StatusClassPipe } from '../../pipes/status.pipes'; 

@Component({
  selector: 'app-package-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusNamePipe, StatusClassPipe],
  templateUrl: './package-detail.component.html',
  styleUrls: ['./package-detail.component.css'],
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
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  loadCouriers() {
    this.packageService.getCouriers().subscribe((data) => {
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

    this.packageService
      .updateStatus(
        this.package.id,
        PackageStatus.WAITING_WITHDRAWAL,
        undefined,
        this.selectedCourierId
      )
      .subscribe({
        next: (updatedPackage) => {
          this.package = updatedPackage;
          this.closeAssignModal();
          alert('Entregador atribuído com sucesso!');
          this.cdr.detectChanges();
        },
        error: () => alert('Erro ao atribuir entregador'),
      });
  }

  // --- Other Actions ---
  changeStatus(newStatus: PackageStatus) {
    if (!this.package) return;

    // For other statuses (Delivery, Return, etc.)
    let notes = '';
    if (newStatus === PackageStatus.RETURNED_WAREHOUSE) {
      notes = prompt('Motivo da devolução:') || 'Devolvido';
    }

    if (confirm('Confirmar alteração de status?')) {
      this.packageService.updateStatus(this.package.id, newStatus, notes).subscribe({
        next: (updated) => {
          this.package = updated;
          this.cdr.detectChanges();
        },
      });
    }
  }

// New Method
  handleAddNote() {
    if (!this.package) return;

    const note = prompt("Digite a observação:");
    
    // Check if user clicked Cancel or typed empty string
    if (note && note.trim().length > 0) {
      this.isLoading = true;
      this.packageService.addNote(this.package.id, note).subscribe({
        next: (updatedPackage) => {
          this.package = updatedPackage;
          this.isLoading = false;
          this.cdr.detectChanges(); // Update UI
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
          alert('Erro ao adicionar nota.');
          this.cdr.detectChanges();
        }
      });
    }
  }  

  goBack() {
    this.location.back();
  }
  
}
