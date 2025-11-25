import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPackage } from './register-package.component';

describe('RegisterPackage', () => {
  let component: RegisterPackage;
  let fixture: ComponentFixture<RegisterPackage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPackage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPackage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
