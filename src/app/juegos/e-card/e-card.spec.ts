import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ECard } from './e-card';

describe('ECard', () => {
  let component: ECard;
  let fixture: ComponentFixture<ECard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ECard],
    }).compileComponents();

    fixture = TestBed.createComponent(ECard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
