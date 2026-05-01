import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAviso } from './modal-aviso';

describe('ModalAviso', () => {
  let component: ModalAviso;
  let fixture: ComponentFixture<ModalAviso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAviso],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAviso);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
