import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidityComponent } from './liquidity.component';

describe('LiquidityComponent', () => {
  let component: LiquidityComponent;
  let fixture: ComponentFixture<LiquidityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
