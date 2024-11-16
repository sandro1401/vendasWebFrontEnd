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
  itensSelecionados: ItemPedido[] = [];
  @Input() pedidoId: number = 0;

  constructor(private produtoService: ProdutoApiService, 
    private pedidoService: PedidoService,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
 
    this.route.params.subscribe((params) => {
      this.pedidoId = +params['pedidoId'];
      if (!this.pedidoId) {
        console.error('Erro: pedidoId está nulo ou inválido!');
      }
    });
    this.carregarProdutos();
  }


  carregarProdutos() {
    this.produtoService.obterProdutos().subscribe(
      (produtos) => {
      this.produtosDisponiveis = produtos;
    }, 
    (error) => {
      console.error('Erro ao carregar produtos:', error);
    }
  );
  }

  adicionarProduto(produto: Produto) {
    if (!this.pedidoId) {
      console.error('Erro: pedidoId está nulo ou inválido!');
      return;
    }
    const item: ItemPedido = {
      id: 0,
      produtoId: produto.id,
      pedidoId: this.pedidoId,
      quantidade:this.quantidade, 
      preco_unitario: produto.preco, 
      concluido: this.concluido
    };
     this.itensSelecionados.push(item);
  }

  finalizarAdicaoDeProdutos() {
    if (this.itensSelecionados.length === 0) {
      console.warn('Nenhum item selecionado para adicionar ao pedido.');
      return;
    }

    this.pedidoService.adicionarItensAoPedido(this.pedidoId, this.itensSelecionados).subscribe(
      () => {
        this.router.navigate(['/pedidos'], { queryParams: { pedidoId: this.pedidoId } });
      },
      (error) => {
        console.error('Erro ao adicionar itens ao pedido:', error);
      }
    );
  }

  obterNomeProduto(produtoId: number): string {
    const produto = this.produtosDisponiveis.find(p => p.id === produtoId);
    return produto ? produto.nome ?? 'Produto desconhecido' : 'Produto desconhecido';
  }
 

  calcularSubtotal(item: ItemPedido): number {
    return (item.preco_unitario ?? 0) * (item.quantidade ?? 0);
  }



  // definirConclusao(item: ItemPedido, concluido: boolean) {
  //   item.concluido = concluido;
  // }

  
  //  calcularValorTotal(): number {
  //   if (this.produtoSelecionado && this.quantidade) {
  //     if (this.produtoSelecionado.preco!== undefined) {
  //       return this.produtoSelecionado.preco * this.quantidade;
  //     } else {
  //       return 0; 
  //     }
  //   } else {
  //     return 0;
  //   }
  // }
 
}