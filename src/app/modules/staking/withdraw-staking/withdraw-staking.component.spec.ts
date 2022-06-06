import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawStakingComponent } from './withdraw-staking.component';

describe('WithdrawStakingComponent', () => {
  let component: WithdrawStakingComponent;
  let fixture: ComponentFixture<WithdrawStakingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithdrawStakingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawStakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
