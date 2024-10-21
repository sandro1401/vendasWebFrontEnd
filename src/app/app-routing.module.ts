import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';
import { ListUsuariosComponent } from './list-usuarios/list-usuarios.component';
import { ListCardProdutosComponent } from './list-card-produtos/list-card-produtos.component';
import { CardProdutosComponent } from './card-produtos/card-produtos.component';
import { CadastroProdutosComponent } from './cadastro-produtos/cadastro-produtos.component';
const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'novo', component: CadastroUsuarioComponent},
  {path: 'lista', component: ListUsuariosComponent},
  {path: 'edit/:id', component: CadastroUsuarioComponent},
  {path: 'listaProdutos', component: ListCardProdutosComponent},
  {path: 'CardProdutos', component: CardProdutosComponent},
  {path: 'cadastroProdutos', component: CadastroProdutosComponent},
  { path: '', redirectTo:'/login', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
