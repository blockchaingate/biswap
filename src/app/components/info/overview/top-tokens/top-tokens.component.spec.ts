import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTokensComponent } from './top-tokens.component';

describe('TopTokensComponent', () => {
  let component: TopTokensComponent;
  let fixture: ComponentFixture<TopTokensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopTokensComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
