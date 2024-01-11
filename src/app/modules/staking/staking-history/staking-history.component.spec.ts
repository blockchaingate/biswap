import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakingHistoryComponent } from './staking-history.component';

describe('StakingHistoryComponent', () => {
  let component: StakingHistoryComponent;
  let fixture: ComponentFixture<StakingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StakingHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StakingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
