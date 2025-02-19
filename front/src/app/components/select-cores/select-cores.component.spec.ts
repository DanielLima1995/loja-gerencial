import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCoresComponent } from './select-cores.component';

describe('SelectCoresComponent', () => {
  let component: SelectCoresComponent;
  let fixture: ComponentFixture<SelectCoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...globalModules,SelectCoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectCoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
