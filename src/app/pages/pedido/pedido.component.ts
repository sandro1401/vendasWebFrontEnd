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
  
  itensPedido: Produto[] = [];

  totalPedido: number = 0;
  usuarioId?: number;
  itensSelecionados: any[] = [];
  pedidoId?: number;
  dataPedido: Date = new Date();
  private itensPedidoSubscription!: Subscription;

  constructor(private authService: AuthService, private pedidoService: PedidoService, 
    private usuarioApiService: UsuarioApiService, 
    private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.criarPedidoVazio();
    this.activatedRoute.paramMap.subscribe(params => {
      const state = params.get('state');
      if (state) {
        try {
          const estadoObj = JSON.parse(state);
          this.itensSelecionados = estadoObj.itensSelecionados;
        } catch (error) {
          console.error('Erro ao parsear o estado:', error);
        }
      } else {
        console.log('Estado não encontrado');
      }
    });
   

    //this.obterUsuarioId();
    this.carregarItensPedido();
    // Inscreva-se para receber atualizações da lista de itens do pedido
    this.itensPedidoSubscription = this.pedidoService.itensPedido$.subscribe(itens => {
      this.itensPedido = itens;
      this.calcularTotal(); // Atualiza o total do pedido
    });

    // Inicialmente, carrega os itens do pedido do backend
    this.pedidoService.obterItensPedido().subscribe();
  }

  ngOnDestroy(): void {
    // Cancela a inscrição para evitar memory leaks
    this.itensPedidoSubscription.unsubscribe();
  }

  // obterUsuarioId() {
  //   // Supondo que você tenha um método para obter o usuário logado
  //   this.authService.obterUsuarioLogado().subscribe((usuario) => {
  //     this.usuarioId = usuario.id;
  //     this.criarPedido(); // Chamar o método para criar o pedido após obter o usuarioId
  //   });
  // }
  
  criarPedido(): void {
    const pedido = {
      usuarioId: this.usuarioId,
      itens: this.itensSelecionados,
      data_Pedido: this.dataPedido,
      
    };
     this.pedidoService.criarPedido(pedido).subscribe((pedidoCriado: any) => {
      const pedidoId = pedidoCriado.id;
      console.log('Pedido criado com sucesso!');
      // Aqui você pode chamar o método para adicionar itens ao pedido recém-criado
      //this.adicionarItemAoPedido(pedidoId);
      
    });
  }
  adicionarItemAoPedido(pedidoId: number): void {
    const itemPedido = {
      pedidoId: 0,
      produtoId: 0,
      quantidade: 0,
      precoUnitario: 0
    };
    itemPedido.pedidoId = pedidoId; // Atribuir o pedidoId ao item pedido
    this.pedidoService.adicionarItemPedido(itemPedido).subscribe(() => {
      // Item adicionado com sucesso
    });
  }

  // Método para calcular o valor total do pedido
  calcularTotal(): void {
    this.totalPedido = this.itensPedido.reduce((acc, item) => acc + (item.preco? item.preco : 0), 0);
  }

  // Método para remover um produto do pedido
  removerProduto(produtoId: number): void {
    this.pedidoService.removerProduto(produtoId).subscribe();
    // Não é necessário atualizar a lista local aqui, pois o serviço já emite a atualização
  }

  // Método para adicionar um produto ao pedido (novo)
  adicionarProduto(produto: Produto): void {
    this.pedidoService.adicionarProduto(produto).subscribe();
    // Não é necessário atualizar a lista local aqui, pois o serviço já emite a atualização
  }
  carregarItensPedido() {
    // Atualmente não está sendo usado, mas pode ser útil para exibir os itens do pedido
  }

  criarPedidoVazio(): void {
    this.pedidoService.criarPedidoVazio().subscribe((pedido: any) => {
      this.pedidoId = pedido.id;
    });
  }
}