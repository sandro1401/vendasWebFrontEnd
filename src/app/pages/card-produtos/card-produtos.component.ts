import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProdutoApiService } from '../../service/produto-api.service';
import { PedidoService } from '../../service/pedido.service';
import { Produto } from '../../models/produto';
@Component({
  selector: 'app-card-produtos',
  templateUrl: './card-produtos.component.html',
  styleUrl: './card-produtos.component.css'
})
export class CardProdutosComponent {
  @Input() produto: any;
  produtos: Produto[] = [];
  
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
    adicionarProdutoAoPedido(produto: Produto) {
      this.pedidoService.adicionarProduto(produto);
      this.router.navigate(['/pedidos']);
    }
    finalizarPedido() {
      this.router.navigate(['/pedidos']);
    }
  //comprar() {
    //this.router.navigate(['/pedidos']);
  //}
}
