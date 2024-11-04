import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule } from '@angular/forms';
import { CadastroUsuarioComponent } from './pages/cadastro-usuario/cadastro-usuario.component';
import { ListUsuariosComponent } from './pages/list-usuarios/list-usuarios.component';
import { FiltroPesquisaPipe } from './filtro-pesquisa.pipe';
import { ReactiveFormsModule } from '@angular/forms';

import { ListCardProdutosComponent } from './pages/list-card-produtos/list-card-produtos.component';
import { CadastroProdutosComponent } from './pages/cadastro-produtos/cadastro-produtos.component';
import { CardProdutosComponent } from './pages/card-produtos/card-produtos.component';
import { PedidoComponent } from './pages/pedido/pedido.component';
import { ItemPedidoComponent } from './pages/item-pedido/item-pedido.component';
import { HeaderComponent } from './header/header.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CadastroUsuarioComponent,
    ListUsuariosComponent,
    FiltroPesquisaPipe,
    ListCardProdutosComponent,
    CadastroProdutosComponent,
    CardProdutosComponent,
    PedidoComponent,
    ItemPedidoComponent,
    HeaderComponent,
   

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatMenuModule,
    MatTooltip,
  ],
  providers: [provideHttpClient(), provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
