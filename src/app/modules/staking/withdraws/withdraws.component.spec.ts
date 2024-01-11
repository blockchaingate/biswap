import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawsComponent } from './withdraws.component';

describe('WithdrawsComponent', () => {
  let component: WithdrawsComponent;
  let fixture: ComponentFixture<WithdrawsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithdrawsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
