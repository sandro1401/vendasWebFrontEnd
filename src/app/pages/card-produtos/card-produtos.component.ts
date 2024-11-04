import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProdutoApiService } from '../../service/produto-api.service';
import { PedidoService } from '../../service/pedido.service';
import { Produto } from '../../models/produto';
import { Usuario } from '../../models/usuario';
import { UsuarioApiService } from '../../service/usuario-api.service';
@Component({
  selector: 'app-card-produtos',
  templateUrl: './card-produtos.component.html',
  styleUrl: './card-produtos.component.css'
})
export class CardProdutosComponent {
  @Input() produto: any;
  produtos: Produto[] = [];
  users: Usuario[] = [];
  
  
  constructor(  private produtoService: ProdutoApiService,
    private pedidoService: PedidoService,private router: Router){}
  
    ngOnInit() {
      this.carregarProdutos();
    }
    carregarProdutos() {
      this.produtoService.obterProdutos().subscribe((produtos) => {
        this.produtos = produtos;
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
