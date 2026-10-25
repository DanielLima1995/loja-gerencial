import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { ProductListService } from '../../product-list/product-list.service';
import { QuillModule } from 'ngx-quill';
import { ProductPreviewComponent } from './product-preview/product-preview.component';
import Swal from 'sweetalert2';
import { GerenciarProdutosService } from './gerenciar-produtos.service';
import { Router } from '@angular/router';
import { mapTagsGroups, TagsGrupo, TagsWithKeys, PreviewData, ProdutoBody, Tag } from '../../../app.interface';
import { globalModules } from '../../../globalModules';
import { GlobalFunctions } from '../../../services/global.service';
import { MaskMoneyDirective } from '../../../shared/mask-money.directive';


@Component({
  selector: 'app-cadastro-produtos',
  templateUrl: './cadastro-produtos.component.html',
  styleUrls: ['./cadastro-produtos.component.scss'],
  imports: [
    ...globalModules,
    QuillModule, // Configuração do Quill.js
    ProductPreviewComponent,
    MaskMoneyDirective 
  ]
})
export class CadastroProdutosComponent implements OnInit  {
  
  @ViewChild('imageUploadInput') imageUploadInput!: ElementRef; // Referência ao input oculto

  
editorModules = {
  toolbar: [
    ['bold', 'italic', 'underline'], 
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link']
  ]
};

tags!: TagsWithKeys;

collapses: { [key: string]: boolean } = {};
previewImages: string[] = []; // Armazena as URLs das imagens para pré-visualização
public Editor: any;
editorContent: string = '<p>Bem-vindo ao Quill.js integrado ao Angular!</p>';
formulario: FormGroup;
conteudoFormularioJson: PreviewData | null = null;
tagsSelecionadas: Record<string, Tag[]> = {};
showPreview = false;
dadosPreview: PreviewData | null = null;
tagsObrigatorias = ['Cores', 'Tamanho'];
carregando: boolean = false;

constructor(
  private productListService: ProductListService,
  private fb: FormBuilder,
  private gerenciarProdutosService: GerenciarProdutosService,
  private globalFunctions: GlobalFunctions,
  private router: Router
) {
  this.formulario = this.fb.group({
    descricao: ['', Validators.required], // Descrição é obrigatória
    descricao_basica: ['', Validators.required], // Descrição básica é obrigatória
    produto_ativo: ['on'], // Produto Ativo, por padrão é false
    valor: [null, [Validators.required, Validators.min(0)]], // Valor não pode ser negativo e é obrigatório
    titulo: ['', Validators.required], // Título é obrigatório
    tags: [],
    imagens: []
  });
}

ngOnInit() {
  this.productListService.getTags(true).subscribe(
    (res: TagsGrupo[]) => {
      this.tags = mapTagsGroups(res);
    },
    () => {
      this.globalFunctions.alertaDadosServidor();
    }
  );

  this.formulario.valueChanges.subscribe(() => {
    if (this.showPreview) {
      this.dadosPreview = this.convertConteudoJson();
    }
    // Aqui você pode executar qualquer ação sempre que um dado do formulário mudar
  });
}

triggerFileInput(): void {
  this.imageUploadInput.nativeElement.click(); // Aciona o clique no input oculto
}

gerenciaCollapse(indice: string) {
  this.collapses[indice] = !this.collapses[indice];
}

onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (input?.files) {
    const files = Array.from(input.files); // Converte FileList em array

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          this.previewImages.push(result);
          this.dadosPreview = this.convertConteudoJson();
        };
        reader.readAsDataURL(file); // Lê o arquivo e cria a URL para pré-visualização
      }
    });
  }
}

removeImage(index: number): void {
  this.previewImages.splice(index, 1); // Remove a imagem selecionada
}

alterarImagemPrincipal(fromIndex: number): string[] {
  if (fromIndex < 0 || fromIndex >= this.previewImages.length || 0 >= this.previewImages.length) {
    throw new Error('Índices fora do limite do array.');
  }

  const item = this.previewImages.splice(fromIndex, 1)[0]; // Remove o item da posição inicial
  this.previewImages.splice(0, 0, item); // Insere o item na nova posição

  return this.previewImages;
}

onSubmit(): void {
  if (this.formulario.valid) {
    const convertTags: Record<string, Tag[]> = {};
    Object.keys(this.tagsSelecionadas).forEach((e) => {
      convertTags[e] = this.tagsSelecionadas[e];
    });

    const value = this.formulario.getRawValue();
    const body: ProdutoBody = {
      titulo: value.titulo,
      descricaoBasica: value.descricao_basica,
      descricao: value.descricao,
      valor: this.parseValor(value.valor),
      imagens: this.previewImages.map((imagemUrl, referencia) => ({ imagemUrl, referencia })),
      tagIds: Object.values(convertTags).flat().map((tag) => tag.id),
    };

    this.gerenciarProdutosService.cadastrarProduto(body).subscribe(
      () => {
        this.globalFunctions.alerta('Produto Cadastrado', 'Produto cadastrado com sucesso', 'success');
        setTimeout(() => {
          this.router.navigate(['/admin/produtos/cadastrados']);
        }, 2000);
      },
      () => {
        this.globalFunctions.alerta('Erro ao Cadastro do Produto', 'Ocorreu uma falha interna ao tentar cadastrar o produto. Tente novamente.', 'error');
      }
    );
  } else {
    this.globalFunctions.alerta('Erro no Cadastro do Produto', 'Alguns dados do formulário estão inválidos. Por favor, revise as informações e tente novamente.', 'error');
  }
}

private parseValor(value: string | number): number {
  if (typeof value === 'number') return value;
  return Number(value.replace(/\./g, '').replace(',', '.'));
}


convertConteudoJson(): PreviewData {
  const dados: PreviewData = {
    descricao: this.formulario.controls['descricao'].value,
    descricaoBasica: this.formulario.controls['descricao_basica'].value,
    ativo: this.formulario.controls['produto_ativo'].value === 'on',
    valor: this.formulario.controls['valor'].value,
    titulo: this.formulario.controls['titulo'].value,
    tags: this.tagsSelecionadas,
    imagens: this.previewImages
  };

  return dados;
}

gerTagsSelecionadas(element: Event, item: string, id: number) {
  const inputElement = element.target as HTMLInputElement;

  if (inputElement.checked) {
    if (!this.tagsSelecionadas[item]) this.tagsSelecionadas[item] = [];
    const tagFiltrada = this.tags.dados[item].find(
      (element: Tag) => element.id === id
    );

    if (tagFiltrada) {
      this.tagsSelecionadas[item].push(tagFiltrada);
    }
  } else {
    const index = this.tagsSelecionadas[item].findIndex((e) => e.id === id);
    if (index > -1) {
      this.tagsSelecionadas[item].splice(index, 1);
    }
  }

  if (this.showPreview) {
    this.dadosPreview = this.convertConteudoJson();
  }
}

togglePreview() {
  this.showPreview = !this.showPreview;
  this.dadosPreview = this.convertConteudoJson();
}

validaTagsObrigatorias(): boolean {
  return this.tagsObrigatorias.every(
    (value) => this.tagsSelecionadas[value] && this.tagsSelecionadas[value].length > 0
  );
}

get formularioValido(): boolean {
  return (
    this.validaTagsObrigatorias() && this.formulario.valid && this.previewImages.length > 0
  );
}



}
