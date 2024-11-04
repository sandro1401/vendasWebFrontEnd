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
 
 itemPedido: any;
  novoPedido: Pedido = {
    quantidade: 1,  
    valorTotal: 0,
    data_Pedido: new Date(),
    produtoId: undefined,  
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
        this.novoPedido.produtoId = parseInt(params['produtoId'])
        this.novoPedido.usuarioId = params['usuarioId'];
     
       
      })
    }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.novoPedido.usuarioId = params['usuarioId']
    });
    const state = this.activatedRoute?.snapshot.paramMap.get('state');
    if (state) {
      const newState = JSON.parse(state);
      if (newState && newState.novoItemId) {
        this.buscarPedido(newState.novoItemId);
      }
    }
  
  }
  buscarPedido(id: number): void {
    this.pedidoService.getPedidoById(id).subscribe(
      (response: any) => {
        this.itemPedido = response;
        console.log('Pedido encontrado:', this.itemPedido);
      },
      (error) => {
        console.error('Erro ao buscar pedido:', error);
        // Tratar erro, por exemplo, exibindo uma mensagem para o usuário
      }
    );}
  adicionarProduto(produto: Produto): void {
    this.pedidoService.adicionarProduto(produto, this.quantidade, this.valorTotal, this.concluido).subscribe(
      (itemPedido: ItemPedido) => {
        // Acesse o preço do item de pedido (supondo que esteja em itemPedido.preco)
        const preco = itemPedido.preco_unitario;
        if (preco)
        this.valorTotal = preco * this.quantidade;
        console.log('Item de pedido adicionado com sucesso. Valor Total:', this.valorTotal);
      },
      (error) => {
        console.error('Erro ao adicionar produto ao pedido:', error);
        // Tratar erro, por exemplo, exibindo uma mensagem para o usuário
      }
    );
  }
}
 