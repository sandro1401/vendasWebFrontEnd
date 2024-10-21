import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';
import { ListUsuariosComponent } from './list-usuarios/list-usuarios.component';
import { FiltroPesquisaPipe } from './filtro-pesquisa.pipe';

import { ListCardProdutosComponent } from './list-card-produtos/list-card-produtos.component';
import { CadastroProdutosComponent } from './cadastro-produtos/cadastro-produtos.component';
import { CardProdutosComponent } from './card-produtos/card-produtos.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CadastroUsuarioComponent,
    ListUsuariosComponent,
    FiltroPesquisaPipe,
    ListCardProdutosComponent,
    CadastroProdutosComponent,
    CardProdutosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
