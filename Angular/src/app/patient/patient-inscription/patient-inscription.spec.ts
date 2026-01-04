import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientInscriptionComponent } from './patient-inscription.component';

describe('PatientInscriptionComponent', () => {
  let component: PatientInscriptionComponent;
  let fixture: ComponentFixture<PatientInscriptionComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientInscriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
