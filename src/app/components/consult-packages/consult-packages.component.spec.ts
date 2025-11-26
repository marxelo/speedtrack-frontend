import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultPackagesComponent } from './consult-packages.component';

describe('ConsultPackagesComponent', () => {
  let component: ConsultPackagesComponent;
  let fixture: ComponentFixture<ConsultPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultPackagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultPackagesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
