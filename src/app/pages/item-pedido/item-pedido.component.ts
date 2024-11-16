import { Component, OnInit, Input } from '@angular/core';
import { Produto } from '../../models/produto';
import { ProdutoApiService } from '../../service/produto-api.service';
import { PedidoService } from '../../service/pedido.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemPedido } from '../../models/item-pedido';
import { Pedido } from '../../models/pedido';

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
  itensPedido: ItemPedido[] = [];
  @Input() pedidoId: number = 1;
  itensSelecionados: ItemPedido[] = [];
  constructor(private produtoService: ProdutoApiService, 
    private pedidoService: PedidoService,private router: Router,
  private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.carregarProdutos();
    this.route.params.subscribe(params => {
      this.pedidoId = +params['pedidoId'];
    });
  }
  adicionarProduto(produto: Produto) {
    const item = new ItemPedido();
    item.produtoId = produto.id;
    item.pedidoId = this.pedidoId;
    item.quantidade = 1; 
    item.preco_unitario = produto.preco; 
    item.concluido = this.concluido
    this.itensSelecionados.push(item);
  }
  finalizarAdicaoDeProdutos() {
    this.pedidoService.adicionarItensAoPedido(this.pedidoId, this.itensSelecionados)
      .subscribe(
        () => {
          this.router.navigate(['/pedidos']);
        },
        error => {
          console.error('Erro ao adicionar itens ao pedido:', error);
        }
      );
  }

  carregarProdutos() {
    this.produtoService.obterProdutos().subscribe((produtos) => {
      this.produtosDisponiveis = produtos;
    });
  }
  selecionarProduto(produto: Produto) {
    this.produtoSelecionado = produto;
  }
  
  adicionarProdutoPedido() {
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
    this.router.navigate(['/pedidos'], { state: { itensSelecionados: this.itensSelecionados } });
   
    }}

  

  removerProduto(produtoId: number) {
    this.pedidoService.removerProduto(produtoId).subscribe(() => {
      this.pedidoService.obterItensPedido().subscribe(itens => {
       
      });
    });
  }
  obterNomeProduto(produtoId: number): string {
    const produto = this.produtosDisponiveis.find(p => p.id === produtoId);
    return produto ? produto.nome ?? 'Produto desconhecido' : 'Produto desconhecido';
  }
 

  calcularSubtotal(item: ItemPedido): number {
    return (item.preco_unitario ?? 0) * (item.quantidade ?? 0);
  }



  definirConclusao(item: ItemPedido, concluido: boolean) {
    item.concluido = concluido;
  }

  
   calcularValorTotal(): number {
    if (this.produtoSelecionado && this.quantidade) {
      if (this.produtoSelecionado.preco!== undefined) {
        return this.produtoSelecionado.preco * this.quantidade;
      } else {
        return 0; 
      }
    } else {
      return 0;
    }
  }
 
}