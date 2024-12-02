import { LOCALE_ID, NgModule } from '@angular/core';
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
import { CadastroCategoriaComponent } from './pages/cadastro-categoria/cadastro-categoria.component';
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
import { ListaProdutosComponent } from './pages/lista-produtos/lista-produtos.component';
import { PesquisaProdutoPipe } from './pesquisa-produto.pipe';
import { ImagensProdutosComponent } from './imagens-produtos/imagens-produtos.component';
import { DataPipe } from './data.pipe';
import { MoedaPipe } from './moeda.pipe';
import { ErroComponent } from './erro/erro.component';
import { ListCategoriaComponent } from './pages/list-categoria/list-categoria.component';
import { PesquisaCategoriaPipe } from './pesquisa-categoria.pipe';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
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
    ListaProdutosComponent,
    PesquisaProdutoPipe,
    ImagensProdutosComponent,
    DataPipe,
    MoedaPipe,
    ErroComponent,
    CadastroCategoriaComponent,
    ListCategoriaComponent,
    PesquisaCategoriaPipe,

   

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
  providers: [provideHttpClient(), provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig
      )),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
