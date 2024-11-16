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

    const pedidoId = this.activatedRoute.snapshot.params['id']; 
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
            this.pedidoAtual.itens = itens; 
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

  
  irParaItemPedido(): void {
    if (this.pedidoAtual && this.pedidoAtual.id) {
      console.log(this.pedidoAtual.id)
      this.router.navigate(['/item-Pedido/pedido/', this.pedidoAtual.id]);
    } else {
      console.error('Pedido atual ou ID do pedido não está definido.');
    }
  }

  // irParaItemPedido() {
  //   const pedidoId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  //   if (pedidoId) {
  //     this.carregarPedido()
  //     this.router.navigate(['/item-Pedido/pedido/', pedidoId]);
  //   } else {
  //     console.error('ID do pedido está indefinido. Não é possível navegar para a página de itens do pedido.');
  //   }
  // }
  // irParaItemPedido(): void {
  //   if (this.pedidoAtual && this.pedidoAtual.id) {
  //     // Navega para a página de ItemPedido com o pedidoId no estado de navegação
  //     this.router.navigate(['/item-Pedido/pedido/', this.pedidoAtual.id], { state: { pedidoId: this.pedidoAtual.id }});
  //   } else {
  //     console.error('Pedido atual ou ID do pedido não está definido.');
  //   }
  // }

 
  atualizarPedido() {
    if (this.pedidoAtual && this.pedidoAtual.id) {
      console.log(this.pedidoAtual)
      this.pedidoService.atualizarPedido(this.pedidoAtual.id, this.pedidoAtual).subscribe(
        response => {
          console.log('Pedido atualizado com sucesso!', response);
          this.router.navigate(['/produtos']);  
        },
        error => {
          console.error('Erro ao atualizar o pedido!', error);
        }
      );
    }
  }


  buscarPedido(id: number): void {
    this.pedidoService.getPedidoById(id).subscribe(
      (response: any) => {
        this.pedido = response;
         console.log('Pedido encontrado:', this.pedido);
      },
      (error) => {
        console.error('Erro ao buscar pedido:', error);
      }
    );}


}
