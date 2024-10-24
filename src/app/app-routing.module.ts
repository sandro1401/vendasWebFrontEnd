import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CadastroUsuarioComponent } from './pages/cadastro-usuario/cadastro-usuario.component';
import { ListUsuariosComponent } from './pages/list-usuarios/list-usuarios.component';
import { ListCardProdutosComponent } from './pages/list-card-produtos/list-card-produtos.component';
import { CardProdutosComponent } from './pages/card-produtos/card-produtos.component';
import { CadastroProdutosComponent } from './pages/cadastro-produtos/cadastro-produtos.component';
import { PedidoComponent } from './pages/pedido/pedido.component';
import { ItemPedidoComponent } from './pages/item-pedido/item-pedido.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'novo', component: CadastroUsuarioComponent},
  {path: 'lista', component: ListUsuariosComponent},
  {path: 'edit/:id', component: CadastroUsuarioComponent},
  {path: 'listaProdutos', component: ListCardProdutosComponent},
  {path: 'CardProdutos', component: CardProdutosComponent},
  {path: 'cadastroProdutos', component: CadastroProdutosComponent},
  {path: 'pedidos', component: PedidoComponent},
  { path: 'item-pedido', component: ItemPedidoComponent },

 { path: '', redirectTo: '/listaProdutos', pathMatch: 'full' }, 
  // { path: '', redirectTo:'/login', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
