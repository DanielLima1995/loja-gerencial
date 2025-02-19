# 📌 E-commerce Gerencial

## 📖 Introdução
Este projeto é uma plataforma de e-commerce totalmente gerenciável, desenvolvida para oferecer um controle dinâmico sobre produtos, pedidos e usuários sem depender de ferramentas externas. Seu objetivo é proporcionar uma experiência intuitiva tanto para administradores quanto para clientes, garantindo flexibilidade e segurança na gestão do negócio.

## 🚀 Tecnologias Utilizadas
- **Angular** 19.0
- **Laravel** 10.48

## 📥 Instalação
```sh
git clone https://github.com/DanielLima1995/loja-gerencial.git

cd loja-gerencial/front
npm install  
ng serve  

cd loja-gerencial/front
composer install
php artisan serve
```

## ⚙️ Configuração do Ambiente (`.env`)
O projeto não faz uso de APIs externas, mas requer a configuração do banco de dados através do arquivo `.env`. Nele, devem ser definidos os parâmetros para conexão com o banco de dados, como host, usuário, senha e nome do banco.

## 🏗️ Estrutura do Projeto
```
src/
├── app/
│   ├── components/       # Componentes reutilizáveis
│   ├── pages/            # Páginas principais
│   ├── services/         # Serviços (HTTP, autenticação, etc.)
│   ├── guards/           # Guards de autenticação
│   ├── app.module.ts     # Módulo principal
│   ├── app.routes.ts     # Definição de rotas
├── assets/               # Imagens, fontes, etc.
├── environments/         # Configurações para diferentes ambientes
└── index.html            # Arquivo principal
```

## 🔐 Autenticação e Autorização
A segurança do sistema é garantida através do **JWT (JSON Web Token)** para autenticação e do **AuthGuard** no Angular para proteger rotas específicas. O sistema distingue entre dois tipos principais de usuários:
- **Admin**: Acesso total ao painel de controle, permitindo o gerenciamento de produtos, pedidos e clientes.
- **Cliente**: Acesso ao painel do cliente, permitindo gerenciar seus próprios pedidos e endereços.

As credenciais do usuário são verificadas no backend, e somente usuários autenticados podem acessar rotas protegidas.

## 🔌 Rotas do Projeto
### **Rotas Públicas**
- `/` - HomeComponent
- `/cadastro` - CadastroComponent
- `/carrinho` - CartComponent
- `/checkout` - CheckoutComponent
- `/produto/detalhes/:id` - ProductDetailsComponent
- `/produtos` - ProductListComponent
- `/login` - LoginComponent
- `/login/checkout` - LoginComponent

### **Rotas Protegidas (Admin)**
- `/admin/produtos/cadastrar` - CadastroProdutosComponent
- `/admin/produtos/editar/:id` - EditarProdutosComponent
- `/admin/produtos/cadastrados` - ProductCadastradosComponent
- `/admin/tags` - TagsComponent
- `/admin/tags/cadastrar` - CadastroTagComponent
- `/admin/tags/editar/:id` - EditarTagComponent
- `/admin/vendas` - VendasComponent
- `/admin/venda/:id` - VendasDetalhesComponent

### **Rotas Protegidas (Cliente)**
- `/cliente/enderecos/cadastrar` - EnderecoCadastrarComponent
- `/cliente/enderecos/cadastrar/checkout` - EnderecoCadastrarComponent
- `/cliente/enderecos/:id/editar` - EditarEnderecoComponent
- `/cliente/enderecos` - EnderecoComponent
- `/cliente/pedidos` - VendasClienteComponent
- `/cliente/pedidos/detalhes/:id` - VendasClienteDetalhesComponent
- `/cliente/enderecos/:id/editar/checkout` - EditarEnderecoComponent

## 📦 Dependências Principais
```json
{
    "@angular/animations": "^19.0.0",
    "@angular/common": "^19.0.3",
    "@angular/compiler": "^19.0.0",
    "@angular/core": "^19.0.0",
    "@angular/forms": "^19.0.0",
    "@angular/router": "^19.0.0",
    "@ckeditor/ckeditor5-angular": "^9.1.0",
    "@ckeditor/ckeditor5-build-classic": "^44.1.0",
    "@fortawesome/angular-fontawesome": "^1.0.0",
    "@fortawesome/fontawesome-free": "^6.7.2",
    "@fortawesome/free-solid-svg-icons": "^6.7.1",
    "@ng-select/ng-select": "^14.1.0",
    "angular-imask": "^7.6.1",
    "bootstrap": "^5.3.3",
    "express": "^4.18.2",
    "imask": "^7.6.1",
    "material-icons": "^1.13.12",
    "ngx-quill": "^27.0.0",
    "quill": "^2.0.3",
    "quill-image-resize-module": "^3.0.0",
    "rxjs": "~7.8.0",
    "sweetalert2": "^11.6.13",
    "tslib": "^2.3.0",
    "zone.js": "~0.15.0"
}
```

## 🎨 Estilização e Responsividade
- Utiliza **Bootstrap 5.3** para estilização.
- Ícones fornecidos pelo **Font Awesome 4.7**.
- A responsividade é gerenciada pelas classes nativas do Bootstrap.

## 📝 Licença
Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

