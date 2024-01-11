import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLiquidityComponent } from './all-liquidity.component';

describe('AllLiquidityComponent', () => {
  let component: AllLiquidityComponent;
  let fixture: ComponentFixture<AllLiquidityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllLiquidityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllLiquidityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
