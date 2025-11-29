import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <--- Import for inputs
import { PackageService } from '../../services/package.service';
import { Package, PackageStatus } from '../../models/speedtrack.models';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  // Search State
  trackingCode: string = '';
  trackingResult: Package | null = null;
  
  // Bot Protection State
  mathChallenge: string = '';
  mathAnswer: number = 0;
  userMathInput: string = '';
  
  // UI State
  isLoading = false;
  errorMessage: string = '';

  constructor(
    private packageService: PackageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.generateMathProblem();
  }

  generateMathProblem() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    
    // Randomize operation (Add or Subtract)
    if (Math.random() > 0.5) {
      this.mathChallenge = `${num1} + ${num2} = ?`;
      this.mathAnswer = num1 + num2;
    } else {
      // Ensure positive result for simplicity
      const max = Math.max(num1, num2);
      const min = Math.min(num1, num2);
      this.mathChallenge = `${max} - ${min} = ?`;
      this.mathAnswer = max - min;
    }
  }

  onTrack() {
    // 1. Reset States
    this.errorMessage = '';
    this.trackingResult = null;

    // 2. Validate Inputs
    if (!this.trackingCode) {
      this.errorMessage = 'Digite um código de rastreio.';
      return;
    }

    // 3. Validate Math (Bot Check)
    if (parseInt(this.userMathInput) !== this.mathAnswer) {
      this.errorMessage = 'Resposta da verificação incorreta. Tente novamente.';
      this.generateMathProblem(); // New challenge
      this.userMathInput = '';
      return;
    }

    // 4. Perform Search
    this.isLoading = true;
    this.packageService.trackPackage(this.trackingCode).subscribe({
      next: (data) => {
        this.trackingResult = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // Force update
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 404) {
          this.errorMessage = 'Encomenda não encontrada. Verifique o código.';
        } else {
          this.errorMessage = 'Erro ao buscar encomenda. Tente novamente.';
        }
        this.generateMathProblem(); // Reset math on error
        this.cdr.detectChanges(); // Force update
      }
    });
  }

  // Helper for Timeline Styling
  getStatusClass(status: string): string {
    switch (status) {
      case 'WAITING_ASSIGNMENT':
      case 'WAITING_WITHDRAWAL': return 'status-waiting';
      case 'WITH_COURIER':
      case 'OUT_FOR_DELIVERY': return 'status-in-transit';
      case 'DELIVERED': return 'status-delivered';
      case 'RETURNED_WAREHOUSE': return 'status-returned';
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