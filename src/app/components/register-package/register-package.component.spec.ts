import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPackageComponent } from './register-package.component';

describe('RegisterPackageComponent', () => {
  let component: RegisterPackageComponent;
  let fixture: ComponentFixture<RegisterPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPackageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPackageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
