import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { IbgeService, IbgeState, IbgeCity } from '../../services/ibge.service';
import { PackageService } from '../../services/package.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-package',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Import modules here
  templateUrl: './register-package.component.html',
  styleUrls: ['./register-package.component.css']
})
export class RegisterPackageComponent implements OnInit {
  packageForm: FormGroup;
  states: IbgeState[] = [];
  cities: IbgeCity[] = [];
  isLoadingCities = false;

  constructor(
    private fb: FormBuilder,
    private ibgeService: IbgeService,
    private packageService: PackageService,
    private router: Router
  ) {
    // Initialize Form
    this.packageForm = this.fb.group({
      partnerCode: ['', Validators.required],
      partnerName: ['', Validators.required],
      recipientName: ['', Validators.required],
      recipientAddress: ['', Validators.required],
      recipientState: ['', Validators.required],
      recipientCity: [{ value: '', disabled: true }, Validators.required], // Disabled until state is chosen
      recipientPhone: ['', Validators.required],
      items: this.fb.array([]) // Dynamic Array
    });
  }

  ngOnInit(): void {
    this.loadStates();
    this.addItem(); // Add one empty item by default
  }

  // --- Getters for easy access in HTML ---
  get itemsFormArray() {
    return this.packageForm.get('items') as FormArray;
  }

  // --- IBGE Logic ---
  loadStates() {
    this.ibgeService.getStates().subscribe(data => {
      this.states = data;
    });
  }

  onStateChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const uf = select.value;

    if (uf) {
      this.isLoadingCities = true;
      this.packageForm.get('recipientCity')?.disable();
      
      this.ibgeService.getCities(uf).subscribe(data => {
        this.cities = data;
        this.isLoadingCities = false;
        this.packageForm.get('recipientCity')?.enable();
      });
    }
  }

  // --- Dynamic Items Logic ---
  addItem() {
    const itemGroup = this.fb.group({
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
    this.itemsFormArray.push(itemGroup);
  }

  removeItem(index: number) {
    this.itemsFormArray.removeAt(index);
  }

  // --- Submit Logic ---
  onSubmit() {
    if (this.packageForm.valid) {
      this.packageService.createPackage(this.packageForm.value).subscribe({
        next: (res) => {
          alert(`Encomenda registrada com sucesso! Código: ${res.trackingCode}`);
          this.router.navigate(['/app/dashboard']);
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao registrar encomenda.');
        }
      });
    } else {
      this.packageForm.markAllAsTouched(); // Trigger validation errors
    }
  }

  cancel() {
    this.router.navigate(['/app/dashboard']);
  }
}