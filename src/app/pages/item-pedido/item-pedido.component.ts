import { Component, OnInit, Input } from '@angular/core';
import { Produto } from '../../models/produto';
import { ProdutoApiService } from '../../service/produto-api.service';
import { PedidoService } from '../../service/pedido.service';
import { Router } from '@angular/router';
import { ItemPedido } from '../../models/item-pedido';

@Component({
  selector: 'app-item-pedido',
  templateUrl: './item-pedido.component.html',
  styleUrls: ['./item-pedido.component.css'] 
})
export class ItemPedidoComponent implements OnInit {
  produtosDisponiveis: Produto[] = [];
  produtoSelecionado!: Produto;
  quantidade: number = 1;
  concluido: boolean = false;
 
  @Input() pedidoId: number = 1;
  itensSelecionados: any[] = [];
  constructor(private produtoService: ProdutoApiService, private pedidoService: PedidoService,private router: Router) { }

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.produtoService.obterProdutos().subscribe((produtos) => {
      this.produtosDisponiveis = produtos;
    });
  }
  selecionarProduto(produto: Produto) {
    this.produtoSelecionado = produto;
  }
  adicionarProdutoAoPedido() {
    if (this.produtoSelecionado && this.pedidoId) {
      const valorTotal = this.calcularValorTotal();
      const itemPedido = {
        quantidade: this.quantidade,
        valorTotal,
        pedidoId: this.pedidoId,
        produtoId: this.produtoSelecionado.id,
        concluido: this.concluido
      };
      console.log(itemPedido)

      this.itensSelecionados.push(itemPedido);
    // Redirecionar para o template de pedido
    this.router.navigate(['/pedidos'], { state: { itensSelecionados: this.itensSelecionados } });
   
    }}

  // adicionarProdutoAoPedido() {
  //   if (this.produtoSelecionado && this.pedidoId) {
  //     this.pedidoService.adicionarProduto(
  //       this.produtoSelecionado,
  //       this.quantidade,
  //       this.pedidoId,
  //       this.concluido
  //     ).subscribe((itemPedidoCriado: ItemPedido) => {
  //       console.log('Item de pedido criado:', itemPedidoCriado);
  //       // Redirecionar para o template de pedido
  //       this.router.navigate(['/pedidos'], { state: { novoItemId: itemPedidoCriado.id } });
  //     },
  //     (error) => {
  //       console.error('Erro ao adicionar produto ao pedido:', error);
  //       // Tratar erro, por exemplo, exibindo uma mensagem para o usuário
  //     });
  //   }}

  removerProduto(produtoId: number) {
    this.pedidoService.removerProduto(produtoId).subscribe(() => {
      // Atualiza a lista de itens do pedido após remover
      this.pedidoService.obterItensPedido().subscribe(itens => {
       
      });
    });
  }
   // Método calcularTotal() não é mais necessário aqui, pois o total é calculado no componente de resumo do pedido
   calcularValorTotal(): number {
    if (this.produtoSelecionado && this.quantidade) {
      if (this.produtoSelecionado.preco!== undefined) {
        return this.produtoSelecionado.preco * this.quantidade;
      } else {
        return 0; // ou algum valor padrão
      }
    } else {
      return 0;
    }
  }
      

 
}