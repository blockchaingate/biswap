import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStakingComponent } from './add-staking.component';

describe('AddStakingComponent', () => {
  let component: AddStakingComponent;
  let fixture: ComponentFixture<AddStakingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStakingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
