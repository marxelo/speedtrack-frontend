import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <--- Import for inputs
import { PackageService } from '../../services/package.service';
import { Package, PackageStatus } from '../../models/speedtrack.models';
import { StatusNamePipe, StatusClassPipe } from '../../pipes/status.pipes'; 

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, StatusNamePipe, StatusClassPipe],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
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

  constructor(private packageService: PackageService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.generateMathProblem();
  }

  generateMathProblem() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;

    // Randomize operation (Add or Subtract)
    if (Math.random() > 0.5) {
      this.mathChallenge = `${num1} + ${num2}?`;
      this.mathAnswer = num1 + num2;
    } else {
      // Ensure positive result for simplicity
      const max = Math.max(num1, num2);
      const min = Math.min(num1, num2);
      this.mathChallenge = `${max} - ${min}?`;
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

        // --- UX IMPROVEMENT: Reset Form on Success ---
        this.trackingCode = '';
        this.userMathInput = '';
        this.generateMathProblem();

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
        this.userMathInput = '';
        this.cdr.detectChanges(); // Force update
      },
    });
  }

}
