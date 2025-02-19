import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';


import { ProductListService } from '../../product-list/product-list.service';
import { QuillModule } from 'ngx-quill';
import { ProductPreviewComponent } from './product-preview/product-preview.component';
import Swal from 'sweetalert2';
import { GerenciarProdutosService } from './gerenciar-produtos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TagsWithKeys, Tag, PreviewData, Produto, TagsProdutos, Galeria } from '../../../app.interface';
import { CarregamentoComponent } from '../../../components/carregamento/carregamento.component';
import { globalModules } from '../../../globalModules';
import { GlobalFunctions } from '../../../services/global.service';
import { MaskMoneyDirective } from '../../../shared/mask-money.directive';

@Component({
  selector: 'app-editar-produtos',
  templateUrl: './editar-produtos.component.html',
  styleUrls: ['./cadastro-produtos.component.scss'],
  imports: [...globalModules,
    
    QuillModule, // Configuração do Quill.js
    ProductPreviewComponent,
    MaskMoneyDirective,
    CarregamentoComponent
  ]
})
export class EditarProdutosComponent implements OnInit  {
  @ViewChild('imageUploadInput') imageUploadInput!: ElementRef; // Referência ao input oculto

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline'], 
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link']
    ]
  };

  selectedItems: any[] = []; // Armazena os itens selecionados
  tags!: TagsWithKeys;

  collapses: { [key: string]: boolean } = {};
  previewImages: string[] = []; // Armazena as URLs das imagens para pré-visualização
  public Editor: any;
  editorContent: string = '';
  formulario: FormGroup;
  conteudoFormularioJson: any;
  tagsSelecionadas: Record<string, Tag[]> = {};
  showPreview = false;
  dadosPreview: PreviewData | null = null;
  tagsObrigatorias = ['Cores', 'Tamanho'];
  produto!: Produto;
  idProduto = 0;
  tagsProduto: { [key: string]: TagsProdutos[] } = {};
  carregando: boolean = false;

  constructor(private productListService: ProductListService, private fb: FormBuilder, private gerenciarProdutosService: GerenciarProdutosService, private route: ActivatedRoute,   private globalFunctions: GlobalFunctions, private router: Router){
    this.formulario = this.fb.group({
      descricao: ['', Validators.required], // Descrição é obrigatória
      descricao_basica: ['', Validators.required], // Descrição básica é obrigatória
      produto_ativo: ['on'], // Produto Ativo, por padrão é false
      valor: [null, [Validators.required, Validators.min(0)]], // Valor não pode ser negativo e é obrigatório
      titulo: ['', Validators.required], // Título é obrigatório
      tags: [],
      imagens: []
    });

    this.idProduto = this.route.snapshot.params['id'];

  }


  ngOnInit(){
    this.carregando = true;

    this.productListService.getTags(true).subscribe(
      res => {
        this.carregando = false;

        this.tags = res;
      },
      () => {
        this.globalFunctions.alertaDadosServidor();
      }
    );

    this.formulario.valueChanges.subscribe(() => {
      if(this.showPreview){
        this.dadosPreview = this.convertConteudoJson();
      }
      // Aqui você pode executar qualquer ação sempre que um dado do formulário mudar
    });

    this.gerenciarProdutosService.getProduto(this.idProduto).subscribe(
      res => {
        this.produto = res.data?.produto;
        this.tagsProduto = res.data?.tags;
        this.init();
      },
      () => {
        this.globalFunctions.alertaDadosServidor();
      }
    );
  }

  init(){
    this.formulario.patchValue({
      descricao: this.produto.descricao,
      descricao_basica: this.produto.descricao_basica,
      produto_ativo: this.produto.ativo ? 'on' : '',
      valor: this.globalFunctions.valorConvertido(this.produto.valor, true),
      titulo: this.produto.titulo,
    });

    Object.keys(this.tagsProduto).map((e) => {
      if(!this.tagsSelecionadas[e]) this.tagsSelecionadas[e] = [];
      this.tagsSelecionadas[e] = this.tagsProduto[e].map(
        (item: any) => {
          return item;
        }
      )
    });

    this.previewImages = this.produto.imagens.map(
      (item: Galeria) => {
        return item.imagem
      }
    )
  }

  triggerFileInput(): void {
    this.imageUploadInput.nativeElement.click(); // Aciona o clique no input oculto
  }

  gerenciaCollapse(indice: string){
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
      let convertTags: any = {};
      Object.keys(this.tagsSelecionadas).map((e) => {
        convertTags[e] = this.tagsSelecionadas[e];
      });

      this.formulario.patchValue({
        imagens: this.previewImages,
        tags: convertTags
      });

      this.gerenciarProdutosService.editarProduto(this.idProduto, this.formulario.value).subscribe(
        () => {
          this.globalFunctions.alerta('Produto Editado', 'Produto editado com sucesso', 'success');
          setTimeout(() => {
            this.router.navigate(['/admin/produtos/cadastrados']);
          }, 2000)
        },
        () => {
          this.globalFunctions.alerta('Erro ao Editar Produto', 'Ocorreu uma falha interna ao tentar editar o produto. Tente novamente.', 'error');
        }
      );
    } else {
      this.globalFunctions.alerta('Falha ao Cadastrar Produto', 'Alguns dados do formulário estão inválidos. Por favor, revise as informações e tente novamente.', 'error');
    }
  }

  convertConteudoJson(){
    let dados : any = [];

    Object.keys(this.formulario.controls).map((e) => {
      dados[e] = this.formulario.controls[e].value;
      });
    
      dados['tags'] = this.tagsSelecionadas;
      dados['imagens'] = this.previewImages;

    return dados;

  }

  gerTagsSelecionadas(target: any, item: string, id:number ){
    if(target.checked){
      if(!this.tagsSelecionadas[item]) this.tagsSelecionadas[item] = [];
      let tagFiltrada = this.tags.dados[item].filter(
        (element: any) =>  element.id == id
      )[0];

      this.tagsSelecionadas[item].push(tagFiltrada);
    }else{
      if(!this.tagsSelecionadas[item]) return;
      let index;
      this.tagsSelecionadas[item].forEach((e: any,i: number) => {
        if(e.id == id){
          index = i;
        }
      });
      if(index) this.tagsSelecionadas[item].splice(index, 1);
    }

    if(this.showPreview){
      this.dadosPreview = this.convertConteudoJson();
    }
  }

  togglePreview(){
    this.showPreview = !this.showPreview;
    this.dadosPreview = this.convertConteudoJson();
  }

  validaTagsObrigatorias(){
    let valid = true;
    this.tagsObrigatorias.forEach(
      value => {
        if(!this.tagsSelecionadas[value] || this.tagsSelecionadas[value].length == 0) valid = false;
      }
    )

    return valid;
  }

  get formularioValido(): boolean{
    return ( this.validaTagsObrigatorias() && this.formulario.valid && this.previewImages.length > 0 );
  }

  isChecked(item: string, id: number): boolean {
    return this.tagsProduto[item] && this.tagsProduto[item]?.filter(
      (el: TagsProdutos) => el.id == id
    )?.length > 0;
  }
}

