import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTamanhosComponent } from './select-tamanhos.component';

describe('SelectCoresComponent', () => {
  let component: SelectTamanhosComponent;
  let fixture: ComponentFixture<SelectTamanhosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...globalModules,SelectTamanhosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectTamanhosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
