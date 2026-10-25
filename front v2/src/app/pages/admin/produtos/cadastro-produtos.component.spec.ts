import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroProdutosComponent } from './cadastro-produtos.component';

describe('CadastroComponent', () => {
  let component: CadastroProdutosComponent;
  let fixture: ComponentFixture<CadastroProdutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...globalModules,CadastroProdutosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroProdutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
