import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPoolsComponent } from './all-pools.component';

describe('AllPoolsComponent', () => {
  let component: AllPoolsComponent;
  let fixture: ComponentFixture<AllPoolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPoolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
