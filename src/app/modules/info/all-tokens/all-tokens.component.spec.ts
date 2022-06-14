import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTokensComponent } from './all-okens.component';

describe('TokensComponent', () => {
  let component: AllTokensComponent;
  let fixture: ComponentFixture<AllTokensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllTokensComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
