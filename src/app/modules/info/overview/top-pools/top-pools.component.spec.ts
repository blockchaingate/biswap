import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPoolsComponent } from './top-pools.component';

describe('TopPoolsComponent', () => {
  let component: TopPoolsComponent;
  let fixture: ComponentFixture<TopPoolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopPoolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopPoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
