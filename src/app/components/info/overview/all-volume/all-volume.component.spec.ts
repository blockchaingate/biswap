import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllVolumeComponent } from './all-volume.component';

describe('AllVolumeComponent', () => {
  let component: AllVolumeComponent;
  let fixture: ComponentFixture<AllVolumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllVolumeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllVolumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
