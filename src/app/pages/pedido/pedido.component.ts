import { Component, OnInit, OnDestroy } from '@angular/core';
import { PedidoService } from '../../service/pedido.service';
import { Produto } from '../../models/produto';
import { Pedido } from '../../models/pedido';
import { Subscription } from 'rxjs';
import { UsuarioApiService } from '../../service/usuario-api.service'; 
import { AuthService } from '../../service/auth/auth.service';
import { ItemPedido } from '../../models/item-pedido';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
})
export class PedidoComponent implements OnInit {
  // pedido: Pedido = new Pedido();
  pedidoId!: number;
  pedidoAtual!: Pedido;
  novoItem: ItemPedido = new ItemPedido();
  itensPedido: ItemPedido[] = [];
 itemPedido: any;
  pedido: Pedido = {
    quantidade: 1,  
    valorTotal: 0,
    data_Pedido: new Date(),
    produtoId: undefined,
    usuarioId: undefined,  
  }
 
  valorTotal: number = 0;
  quantidade: number = 1;
  concluido: boolean = false;
  private itensPedidoSubscription!: Subscription;
  constructor(private authService: AuthService, private pedidoService: PedidoService, 
    private usuarioApiService: UsuarioApiService, 
    private router: Router, private activatedRoute: ActivatedRoute) {
      this.activatedRoute.queryParams.subscribe(params =>{
       console.log(params)
        this.pedido.produtoId = parseInt(params['produtoId'])
        this.pedido.usuarioId = params['usuarioId'];
        
     
       
      })
    }

  ngOnInit(): void {
    // const pedidoId = this.activatedRoute.snapshot.paramMap.get('id');
    // if (pedidoId) {
    //   this.carregarPedido();
    // }
    const pedidoId = this.activatedRoute.snapshot.params['id']; // Supondo que o ID seja passado pela rota
    this.pedidoService.getPedidoById(pedidoId).subscribe((pedido) => {
      this.pedidoAtual = pedido;
    });
  }


  adicionarItemAoPedido(produto:Produto, quantidade: number) {
    this.novoItem.produtoId = produto.id;
    this.novoItem.quantidade = quantidade;
    this.novoItem.pedidoId = this.pedidoAtual!.id;
    this.pedidoService.adicionarProdutoPedido(
        produto,
        quantidade,
        this.pedidoAtual.id!
    ).subscribe({
        next: (itemPedido) => {
            console.log('Item adicionado ao pedido:', itemPedido);
            // Atualiza a lista de itens no pedido atual (opcional)
            this.pedidoAtual.itens = this.pedidoAtual.itens || [];
            this.pedidoAtual.itens.push(itemPedido);
        },
        error: (err) => console.error('Erro ao adicionar item:', err)
    });
}

carregarPedido() {
  const pedidoId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  if (pedidoId) {
    this.pedidoService.getPedidoById(pedidoId).subscribe({
      next: (pedido) => {
        this.pedidoAtual = pedido;
        console.log('Pedido carregado:', this.pedidoAtual); 
        this.pedidoService.getItensPedidoByPedidoId(pedidoId).subscribe({
          next: (itens) => {
            this.pedidoAtual.itens = itens; // Adicionar os itens ao pedido atual
            console.log('Itens do pedido carregados:', itens);
          },
          error: (err) => {
            console.error('Erro ao carregar itens do pedido:', err);
          },
        });
      },
      error: (err) => {
        console.error('Erro ao carregar o pedido:', err);
      },
    });
  }
}


  atualizarValorTotal() {
    this.pedido.valorTotal = this.itensPedido.reduce((total, item) => {
      const preco = item.preco_unitario ?? 0;
      const quantidade = item.quantidade ?? 0;
      return total + (preco * quantidade);
    }, 0);
  }
  
  irParaItemPedido() {
    const pedidoId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (pedidoId) {
      this.carregarPedido()
      this.router.navigate(['/item-Pedido/pedido/', pedidoId]);
    } else {
      console.error('ID do pedido está indefinido. Não é possível navegar para a página de itens do pedido.');
      // Opcional: exibir uma mensagem para o usuário ou tomar alguma ação
    }
  }

 
  finalizarPedido() {
    this.pedido.quantidade = this.itensPedido.length;
  
    this.pedidoService.salvarPedido(this.pedido, this.itensPedido).subscribe(response => {
      console.log("Pedido salvo com sucesso!", response);
      // Redirecione ou mostre uma mensagem de confirmação
    });
  }


  buscarPedido(id: number): void {
    this.pedidoService.getPedidoById(id).subscribe(
      (response: any) => {
        this.pedido = response;
         console.log('Pedido encontrado:', this.pedido);
      },
      (error) => {
        console.error('Erro ao buscar pedido:', error);
        // Tratar erro, por exemplo, exibindo uma mensagem para o usuário
      }
    );}


}

  // adicionarProduto(produto: Produto): void {
  //   this.pedidoService.adicionarProduto(produto, this.quantidade, this.valorTotal, this.concluido).subscribe(
  //     (itemPedido: ItemPedido) => {
  //       // Acesse o preço do item de pedido (supondo que esteja em itemPedido.preco)
  //       const preco = itemPedido.preco_unitario;
  //       if (preco)
  //       this.valorTotal = preco * this.quantidade;
  //       console.log('Item de pedido adicionado com sucesso. Valor Total:', this.valorTotal);
  //     },
  //     (error) => {
  //       console.error('Erro ao adicionar produto ao pedido:', error);
  //       // Tratar erro, por exemplo, exibindo uma mensagem para o usuário
  //     }
  //   );
  // }