import {  ChangeDetectionStrategy, ChangeDetectorRef,Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProdutoApiService } from '../../service/produto-api.service';
import { PedidoService } from '../../service/pedido.service';
import { Produto } from '../../models/produto';
import { Usuario } from '../../models/usuario';
import { UsuarioApiService } from '../../service/usuario-api.service';
@Component({
  selector: 'app-card-produtos',
  templateUrl: './card-produtos.component.html',
  styleUrl: './card-produtos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardProdutosComponent implements OnInit {
  @Input() produto: any = '';
  
  produtos: Produto[] = [];
  users: Usuario[] = [];
  @Input() imagens_url: string = '';
  imagensTratadas: { [key: number]: string[] } = {};
 
  indiceImagAtual: number = 0;

  
  
  constructor(  private produtoService: ProdutoApiService,
    private pedidoService: PedidoService,private router: Router,
     private changeDetectorRef: ChangeDetectorRef){}
  
    ngOnInit(){
       this.carregarProdutos();

  
    }

    carregarProdutos() {
      this.produtoService.obterProdutos().subscribe((produtos) => {
        this.produtos = produtos.map((produto) => {
          if (produto.imagem_url) {
            if (Array.isArray(produto.imagem_url)) {
              // Caso seja um array de imagens
              const imagensCorrigidas = produto.imagem_url.map((imgPath) => {
                // Remove caracteres extras e corrige o caminho
                return `http://localhost:3000/${imgPath.replace(/[{}"]/g, '').replace(/\\/g, '/').replace('uploads/', 'uploads/')}`;
              });
              if (produto.id) {
                this.imagensTratadas[produto.id] = imagensCorrigidas;
              }
            } else if (typeof produto.imagem_url === 'string') {
              // Caso seja uma string (uma única imagem)
              const imagemCorrigida = `http://localhost:3000/${produto.imagem_url.replace(/[{}"]/g, '').replace(/\\/g, '/').replace('uploads/', 'uploads/')}`;
              if (produto.id) {
                this.imagensTratadas[produto.id] = [imagemCorrigida];
              }
            }
          }
    
          return produto;
        });
    
        this.changeDetectorRef.detectChanges();
      });
    }
    

    adicionarProdutoAoPedido(produto: Produto)  {
      // this.pedidoService.adicionarProduto(produto);
      this.router.navigate(['/pedidos'],{
        queryParams:{
          produtoId: produto.id,
          usuarioId: this.obterUsuarioLogado() 
                }
      })};
    
      obterUsuarioLogado(){
        const userId = sessionStorage.getItem('usuario.id')
        
        return userId

      }

      finalizarPedido() {
      this.router.navigate(['/pedidos']);
    }
  //comprar() {
    //this.router.navigate(['/pedidos']);
  //}
}
