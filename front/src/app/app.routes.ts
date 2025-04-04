import { Routes } from '@angular/router';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { VendasClienteDetalhesComponent } from './pages/cliente/compras/vendas-cliente-detalhes.component';
import { VendasClienteComponent } from './pages/cliente/compras/vendas-cliente.component';
import { EditarEnderecoComponent } from './pages/cliente/endereco/editar-endereco.component';
import { EnderecoCadastrarComponent } from './pages/cliente/endereco/endereco-cadastrar.component';
import { EnderecoComponent } from './pages/cliente/endereco/endereco.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ProductCadastradosComponent } from './pages/admin/produtos-cadastrados/produtos-cadastrados.component';
import { CadastroProdutosComponent } from './pages/admin/produtos/cadastro-produtos.component';
import { EditarProdutosComponent } from './pages/admin/produtos/editar-produtos.component';
import { CadastroTagComponent } from './pages/admin/tags/gerenciar-tags/cadastro-tag.component';
import { EditarTagComponent } from './pages/admin/tags/gerenciar-tags/editar-tag.component';
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
    { path: 'produto/detalhes/:id', component: ProductDetailsComponent },
    { path: 'produtos', component: ProductListComponent },
    { path: 'login', component: LoginComponent },
    { path: 'login/checkout', component: LoginComponent },
    {
      path: 'admin',
      canActivate: [AuthGuard], // Aplica o guard nas rotas admin
      children: [
        { path: 'produtos/cadastrar', component: CadastroProdutosComponent },
        { path: 'produtos/editar/:id', component: EditarProdutosComponent },
        { path: 'produtos/cadastrados', component: ProductCadastradosComponent },
        { path: 'tags', component: TagsComponent },
        { path: 'tags/cadastrar', component: CadastroTagComponent },
        { path: 'tags/editar/:id', component: EditarTagComponent },
        { path: 'vendas', component: VendasComponent },
        { path: 'venda/:id', component: VendasDetalhesComponent },
      ],
    },
    {
      path: 'cliente',
      canActivate: [AuthGuard], // Aplica o guard nas rotas cliente
      children: [
        { path: 'enderecos/cadastrar', component: EnderecoCadastrarComponent },
        { path: 'enderecos/cadastrar/checkout', component: EnderecoCadastrarComponent },
        { path: 'enderecos/:id/editar', component: EditarEnderecoComponent },
        { path: 'enderecos', component: EnderecoComponent },
        { path: 'pedidos', component: VendasClienteComponent },
        { path: 'pedidos/detalhes/:id', component: VendasClienteDetalhesComponent },
        { path: 'enderecos/:id/editar/checkout', component: EditarEnderecoComponent },
      ],
    },
];
