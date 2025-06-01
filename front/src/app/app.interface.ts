export interface CarrinhoProdutos {
    id: number;
    cor: number;
    quantidade: number;
    tamanho: number;
    produto: Produto;
    tag?: Tag;
    tamanho_detalhes?: Tag;
    refId?:number; //gerenciamento fake - front 
  }
  
  // Interface para Produto
  export interface Produto {
    quantidade: number;
    id: number;
    titulo: string;
    descricao_basica: string;
    descricao?: string;
    valor: number;
    ativo?: boolean;
    data: string; // formato ISO ou ajustar conforme necessário
    imagens: Galeria[];
    imagemPrincipal: Galeria;
    tagsProdutos?: TagsProdutos[];
    refId?:number; //gerenciamento fake - front 
    tamanho?: number;
    cor?: number;
    tag_descricao?: string;
    tamanho_descricao?: string;
  }
  
  // Interface para Tag
  export interface Tag {
    id: number;
    tipo: string;
    descricao: string;
    cor?: string;
    tamanho?:string;
  }
  
  // Interface para Galeria
  export interface Galeria {
    id: number;
    imagem: string; // Base64 ou URL da imagem
    referencia: string;
  }
  
  // Interface para TagsProdutos
  export interface TagsProdutos {
    id: number;
    tags: Tag;
  }
  


// Interface para CarrinhoProdutos
export interface Carrinho {
    id: number;
    status: string;
    carrinhoProdutos?: CarrinhoProdutos[];
    tags?: Tag[];
    tag?: Tag;
  }
  
  // Interface para ProdutoFotos
  export interface ProdutoFotos {
    id: number;
    idProduto: number;
    imagem: string;
    posicao: number;
  }
  
  // Interface para TipoUsuario
  export interface TipoUsuario {
    id: number;
    descricao: string;
  }
  
  // Interface para Usuario
  export interface Usuario {
    id: number;
    nome: string;
    documento: string;
    tipo_usuario: TipoUsuario;
  }
  
  // Interface para VendasProdutos
  export interface VendasProdutos {
    id: number;
    quantidade: number;
    valorUnitario: number;
    tags: VendasProdutosTags[];
    produto: Produto;
  }
  
  // Interface para VendasProdutosTags
  export interface VendasProdutosTags {
    id: number;
    vendaProdutoId: number;
    detalhes: Tag;
  }
  
  // Interface para Vendas
  export interface Vendas {
    id: number;
    status: string;
    data_compra: string; // formato ISO ou ajustar conforme necessário
    forma_pagamento: string;
    valor: number;
    vendaProdutos: VendasProdutos[];
    cliente: Usuario;
    quantidadeTotal?: number;
  }
  
  export interface TagsTratadas {
    id:number,
    descricao: string,
    cor?: string,
    tipo: string,
    tamanho?: string
  }

  export interface ItemExclusaoRef {
    id:number,
    cor: number,
  }

  
export interface Item {
  id: number;
  name: string;
}

export interface PreviewData {
  descricao: string;
  descricao_basica: string;
  produto_ativo: boolean;
  valor: number | null;
  titulo: string;
  tags: Record<string, Tag[]>;
  imagens: string[];
}

export interface TagsWithKeys {
  dados: Record<string, Tag[]>;
  chaves: Array<string>
}

export interface AlertaConfig {
  title: string;
  mensagem: string;
  icon: 'success' | 'error' | 'warning' | 'info' | 'question';
}

export interface Endereco {
  id: number;
  cliente_id: number;
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  numero: string;
  complemento: string | null;
  ponto_referencia: string | null;
}

export interface UsuarioCadastrar{
  senha: string;
  confirmSenha: string;
  email: string;
  cpf: string;
  nome: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface ProdutoBody {
  titulo: string; // Obrigatório, string, máximo de 255 caracteres
  descricao_basica: string; // Obrigatório, string, máximo de 255 caracteres
  descricao: string; // Obrigatório, string
  valor: string; // Obrigatório, string
  imagens: string[]; // Obrigatório, array de strings
  tags: Array<Record<string, any>>; // Obrigatório, array de objetos
}

export interface Menu {
  title: string;
  link: string;
  icon: string;
  ref: string;
}

export interface MenuExterno{
  title: string;
  link: string;
  icon: string;
}