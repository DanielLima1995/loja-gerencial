export interface ProdutoImagem {
  id?: number;
  imagemUrl: string;
  referencia: number;
  produtoId?: number;
}

export interface Tag {
  id: number;
  tipo: string;
  descricao: string;
  cor?: string;
}

export interface TagsGrupo {
  tipo: string;
  tags: Tag[];
}

export interface TagsWithKeys {
  dados: Record<string, Tag[]>;
  chaves: string[];
}

export function mapTagsGroups(groups: TagsGrupo[]): TagsWithKeys {
  const dados: Record<string, Tag[]> = {};
  (groups ?? []).forEach((group) => {
    if (group?.tipo) {
      dados[group.tipo] = (group.tags ?? []).filter(Boolean);
    }
  });
  return { dados, chaves: Object.keys(dados) };
}

export function setImagemPrincipal<T extends Produto>(produto: T): T {
  produto.imagens = [...(produto.imagens ?? [])]
    .filter((imagem) => !!imagem && typeof imagem.referencia === 'number')
    .sort((a, b) => a.referencia - b.referencia);
  produto.imagemPrincipal = produto.imagens[0];
  return produto;
}

export interface Produto {
  id: number;
  titulo: string;
  descricaoBasica: string;
  descricao: string;
  valor: number;
  ativo: boolean;
  dataCadastro: string;
  usuarioId?: string;
  imagens: ProdutoImagem[];
  tagIds: number[];
  tags: Tag[];
  quantidade?: number;
  tamanhoId?: number;
  corId?: number;
  generoId?: number;
  refId?: number;
  tamanhoDescricao?: string;
  tagDescricao?: string;
  imagemPrincipal?: ProdutoImagem;
}

export interface ProdutoCarrinho extends Produto {
  quantidade: number;
  tamanhoId: number;
  corId: number;
  generoId: number;
  refId: number;
}

export interface ProdutoFilter {
  page?: number;
  perPage?: number;
  titulo?: string;
  precoMin?: number;
  precoMax?: number;
  ativo?: boolean;
  usuarioId?: string;
  tags?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface TagsFilter {
  descricao?: string;
  tipo?: string;
  cor?: string;
  isCadastro?: boolean;
}

export interface CarrinhoProduto {
  id: number;
  carrinhoId: number;
  produtoId: number;
  tamanhoId: number;
  quantidade: number;
  dataInclusao: string;
  generoId: number;
  corId: number;
  produto: Produto;
  tamanho: Tag;
  genero: Tag;
  cor: Tag;
}

export interface CarrinhoProdutoInput {
  produtoId: number;
  tamanhoId: number;
  quantidade: number;
  generoId: number;
  corId: number;
  refId?: number;
}

export interface Carrinho {
  id: number;
  usuarioId: string;
  status: string;
  produtos: CarrinhoProduto[];
}

export interface TipoUsuario {
  id: number;
  descricao: string;
}

export interface Usuario {
  id?: number;
  email?: string;
  nome: string;
  documento?: string;
  tipoUsuario: TipoUsuario | string;
}

export interface VendaProduto {
  id: number;
  vendaId: number;
  produtoId: number;
  quantidade: number;
  valorUnitario: number;
  tamanho: string;
  genero: string;
  cor: string;
  produto?: Produto;
}

export interface Endereco {
  id: number;
  clienteId: string;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  numero: string;
  complemento: string | null;
  pontoReferencia: string | null;
}

export type EnderecoInput = Omit<Endereco, 'id' | 'clienteId'>;

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export interface Vendas {
  id: number;
  status: string;
  usuarioId?: string;
  clienteId?: string;
  enderecoId: number;
  dataCompra: string;
  formaPagamento: string;
  valorFinal: number;
  endereco?: Endereco;
  produtos: VendaProduto[];
  quantidadeTotal?: number;
}

export interface VendaInput {
  enderecoId: number;
  formaPagamento: string;
}

export interface VendaStatusInput {
  status: string;
}

export interface TagInput {
  descricao: string;
  cor: string;
  tipo: string;
}

export interface TagsTratadas {
  id: number;
  descricao: string;
  cor?: string;
  tipo: string;
  tamanho?: string;
}

export interface ItemExclusaoRef {
  id: number;
  cor: number;
}

export interface Item {
  id: number;
  name: string;
}

export interface PreviewData {
  descricao: string;
  descricaoBasica: string;
  ativo: boolean;
  valor: number | null;
  titulo: string;
  tags: Record<string, Tag[]>;
  imagens: string[];
}

export interface AlertaConfig {
  title: string;
  mensagem: string;
  icon: 'success' | 'error' | 'warning' | 'info' | 'question';
}

export interface UsuarioCadastrar {
  email: string;
  password: string;
  name: string;
  documento: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ProdutoBody {
  titulo: string;
  descricaoBasica: string;
  descricao: string;
  valor: number;
  imagens: ProdutoImagem[];
  tagIds: number[];
  ativo?: boolean;
}

export interface Menu {
  title: string;
  link: string;
  icon: string;
  ref: string;
}

export interface MenuExterno {
  title: string;
  link: string;
  icon: string;
}
