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
import { ListaProdutosComponent } from './pages/lista-produtos/lista-produtos.component';
import { AuthGuard } from './service/auth/auth.guard';
import { CadastroCategoriaComponent } from './pages/cadastro-categoria/cadastro-categoria.component';
import { ListCategoriaComponent } from './pages/list-categoria/list-categoria.component';
import { canActivate, loggedIn, redirectUnauthorizedTo} from '@angular/fire/auth-guard'

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'novoUsuario', component: CadastroUsuarioComponent},
  {path: 'lista', component: ListUsuariosComponent,canActivate: [AuthGuard]},
  {path: 'edit/:id', component: CadastroUsuarioComponent},
  {path: 'produtos', component: ListCardProdutosComponent,canActivate: [AuthGuard]},
 {path: 'listaProdutos', component: ListaProdutosComponent,canActivate: [AuthGuard]},
  {path: 'CardProdutos', component: CardProdutosComponent},
  {path: 'cadastroProdutos', component: CadastroProdutosComponent,canActivate: [AuthGuard]},
  {path: 'editProduto/:id', component: CadastroProdutosComponent, canActivate: [AuthGuard]},
  {path: 'pedidos/:id', component: PedidoComponent,canActivate: [AuthGuard]},
  { path: 'item-Pedido/pedido/:id', component: ItemPedidoComponent,canActivate: [AuthGuard]},
  {path: 'cadastroCategorias', component: CadastroCategoriaComponent, canActivate: [AuthGuard]},
  {path: 'editCategoria/:id', component: CadastroCategoriaComponent, canActivate: [AuthGuard]},
  {path: 'ListaCategoria', component: ListCategoriaComponent, canActivate: [AuthGuard]},
  

 { path: '', redirectTo: '/produtos', pathMatch: 'full' }, 
  // { path: '', redirectTo:'/login', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
