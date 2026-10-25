import { Routes } from '@angular/router';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { VendasClienteDetalhesComponent } from './pages/cliente/compras/vendas-cliente-detalhes.component';
import { VendasClienteComponent } from './pages/cliente/compras/vendas-cliente.component';
import { EnderecoCadastrarComponent } from './pages/cliente/endereco/endereco-cadastrar.component';
import { EnderecoComponent } from './pages/cliente/endereco/endereco.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ProductCadastradosComponent } from './pages/admin/produtos-cadastrados/produtos-cadastrados.component';
import { CadastroProdutosComponent } from './pages/admin/produtos/cadastro-produtos.component';
import { EditarProdutosComponent } from './pages/admin/produtos/editar-produtos.component';
import { CadastroTagComponent } from './pages/admin/tags/gerenciar-tags/cadastro-tag.component';
import { TagsComponent } from './pages/admin/tags/tags.component';
import { VendasDetalhesComponent } from './pages/admin/vendas/vendas-detalhes.component';
import { VendasComponent } from './pages/admin/vendas/vendas.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { ProductListComponent } from './pages/product-list/product-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'carrinho', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  {
    path: 'produto/detalhes/:id',
    component: ProductDetailsComponent,
    data: { renderMode: 'csr' },
  },
  { path: 'produtos', component: ProductListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/checkout', component: LoginComponent },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    children: [
      { path: 'produtos/cadastrar', component: CadastroProdutosComponent },
      {
        path: 'produtos/editar/:id',
        component: EditarProdutosComponent,
        data: { renderMode: 'csr' },
      },
      { path: 'produtos/cadastrados', component: ProductCadastradosComponent },
      { path: 'tags', component: TagsComponent },
      { path: 'tags/cadastrar', component: CadastroTagComponent },
      { path: 'vendas', component: VendasComponent },
      {
        path: 'venda/:id',
        component: VendasDetalhesComponent,
        data: { renderMode: 'csr' },
      },
    ],
  },
  {
    path: 'cliente',
    canActivate: [AuthGuard],
    children: [
      { path: 'enderecos/cadastrar', component: EnderecoCadastrarComponent },
      {
        path: 'enderecos/cadastrar/checkout',
        component: EnderecoCadastrarComponent,
      },
      { path: 'enderecos', component: EnderecoComponent },
      { path: 'pedidos', component: VendasClienteComponent },
      {
        path: 'pedidos/detalhes/:id',
        component: VendasClienteDetalhesComponent,
        data: { renderMode: 'csr' },
      },
    ],
  },
];
