import { Component, OnInit, Input } from '@angular/core';
import { Produto } from '../../models/produto';
import { ProdutoApiService } from '../../service/produto-api.service';
import { PedidoService } from '../../service/pedido.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemPedido } from '../../models/item-pedido';
import { Pedido } from '../../models/pedido';
import { PedidoDataService } from '../../service/pedido-data.service';
import { ChangeDetectorRef } from '@angular/core';
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
  pedidoAtual!: Pedido; 
  @Input() pedidoId: number = 0;

  constructor(private produtoService: ProdutoApiService, 
    private pedidoService: PedidoService,
    private router: Router,
    private route: ActivatedRoute,
  private pedidoDataService: PedidoDataService,
  private cdr: ChangeDetectorRef, 
  ) {}

  ngOnInit(): void {
 
    this.route.params.subscribe((params) => {
      this.pedidoId = +params['id'];
      if (!this.pedidoId) {
        console.error('Erro: pedidoId está nulo ou inválido!');
      }
    });
    this.carregarProdutos();
    const itens = this.pedidoDataService.getItensSelecionados();
    console.log(itens)
    if (itens && itens.length > 0) {
      this.adicionarNovosItens(itens);
      console.log(itens)
      this.pedidoDataService.clearItensSelecionados(); // Limpar dados temporários
    }
  }


  adicionarNovosItens(novosItens: ItemPedido[]) {
    if (!this.pedidoAtual || !this.pedidoAtual.itens) {
      this.pedidoAtual.itens = [];
    }
    // Adicionar os itens selecionados
    novosItens.forEach(item => this.pedidoAtual.itens?.push(item));
 
    // Atualizar o valor total do pedido
    this.calcularValorTotal();
    this.cdr.detectChanges();
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
      id:0,
      produtoId: produto.id,
      pedidoId: this.pedidoId,
      quantidade:this.quantidade, 
      preco_unitario: produto.preco, 
      concluido: this.concluido
    };
     this.itensSelecionados.push(item);
     this.cdr.detectChanges();
  }

  finalizarAdicaoDeProdutos() {
    if (this.itensSelecionados.length === 0) {
      console.warn('Nenhum item selecionado para adicionar ao pedido.');
      return;
    }
    this.cdr.detectChanges();
    this.pedidoDataService.setItensSelecionados(this.itensSelecionados);
   
    this.router.navigate(['/pedidos', this.pedidoId]);
  }
  


  obterNomeProduto(produtoId: number): string {
    const produto = this.produtosDisponiveis.find(p => p.id === produtoId);
    return produto ? produto.nome ?? 'Produto desconhecido' : 'Produto desconhecido';
  }
 

  calcularSubtotal(item: ItemPedido): number {
    return (item.preco_unitario ?? 0) * (item.quantidade ?? 0);
  }



  definirConclusao(item: ItemPedido, concluido: boolean = true) {
    item.concluido = concluido;
    alert(`Pedido Concluído com Sucesso!! Favor Fechar Pedido`)
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