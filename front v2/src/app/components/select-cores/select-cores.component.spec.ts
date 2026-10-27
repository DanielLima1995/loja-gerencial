import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCoresComponent } from './select-cores.component';

describe('SelectCoresComponent', () => {
  let component: SelectCoresComponent;
  let fixture: ComponentFixture<SelectCoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectCoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectCoresComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('selects a color and emits its id when its option is clicked', () => {
    const color = { id: 42, tipo: 'Cor', descricao: 'Azul', cor: '#0000ff' };
    const selectedColor = jasmine.createSpy('selectedColor');
    component.selectedColor.subscribe(selectedColor);
    fixture.componentRef.setInput('tags', [color, color]);
    fixture.detectChanges();

    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.color-option');
    const button = buttons[0];
    button.click();
    fixture.detectChanges();

    expect(buttons.length).toBe(1);
    expect(selectedColor).toHaveBeenCalledOnceWith(color.id);
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });
});
