import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharablePortfolioComponent } from './sharable-portfolio.component';

describe('SharablePortfolioComponent', () => {
  let component: SharablePortfolioComponent;
  let fixture: ComponentFixture<SharablePortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharablePortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharablePortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
