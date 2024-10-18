import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';
import { ListUsuariosComponent } from './list-usuarios/list-usuarios.component';
const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'novo', component: CadastroUsuarioComponent},
  {path: 'lista', component: ListUsuariosComponent},
  {path: 'edit/:id', component: CadastroUsuarioComponent},
  { path: '', redirectTo:'/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
