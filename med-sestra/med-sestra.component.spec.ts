import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedSestraComponent } from './med-sestra.component';

describe('MedSestraComponent', () => {
  let component: MedSestraComponent;
  let fixture: ComponentFixture<MedSestraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedSestraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedSestraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
