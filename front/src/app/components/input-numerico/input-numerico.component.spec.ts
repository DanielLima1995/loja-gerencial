import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputNumericoComponent } from './input-numerico.component';

describe('InputNumericoComponent', () => {
  let component: InputNumericoComponent;
  let fixture: ComponentFixture<InputNumericoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...globalModules,InputNumericoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputNumericoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
