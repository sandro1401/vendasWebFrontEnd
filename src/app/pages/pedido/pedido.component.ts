import { Component, OnInit, OnDestroy } from '@angular/core';
import { PedidoService } from '../../service/pedido.service';
import { Produto } from '../../models/produto';
import { Pedido } from '../../models/pedido';
import { Subscription } from 'rxjs';
import { UsuarioApiService } from '../../service/usuario-api.service'; 
import { AuthService } from '../../service/auth/auth.service';
import { ItemPedido } from '../../models/item-pedido';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidoDataService } from '../../service/pedido-data.service';
import { Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { ProdutoApiService } from '../../service/produto-api.service';


@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
 
})
export class PedidoComponent implements OnInit {
  // pedido: Pedido = new Pedido();
  pedidoId!: number;
  pedidoAtual!: Pedido;
  pedidoAtual$: Observable<Pedido> = new Observable();
  novoItem: ItemPedido = new ItemPedido();
  itensPedido: ItemPedido[] = [];
  itensSelecionados: ItemPedido[] = [];
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
  constructor(private authService: AuthService, 
    private pedidoService: PedidoService, 
    private usuarioApiService: UsuarioApiService, 
    private router: Router, private activatedRoute: ActivatedRoute,
    private pedidoDataService: PedidoDataService,
    private cdr: ChangeDetectorRef,
    private produtoService: ProdutoApiService,
  ) 
    {
      this.activatedRoute.queryParams.subscribe(params =>{
        this.pedido.produtoId = parseInt(params['produtoId'])
        this.pedido.usuarioId = params['usuarioId'];})}
        ngOnInit(): void {
          // Inicializa pedidoAtual
          this.pedidoAtual = {
            id: undefined,
            quantidade: undefined,
            valorTotal: undefined,
            data_Pedido: undefined,
            produtoId: undefined,
            usuarioId: undefined,
            itens: [],
          };
          console.log('Pedido atual inicializado:', this.pedidoAtual);
        
          const pedidoId = this.activatedRoute.snapshot.params['id'];
          if (!pedidoId) {
            console.error('Erro: pedidoId está nulo ou inválido!');
            return;
          }
          this.pedidoService.getPedidoById(pedidoId).subscribe((pedido) => {
            this.pedidoAtual = pedido;
            console.log('Pedido carregado da API:', this.pedidoAtual);
            if (this.pedidoAtual.itens && this.pedidoAtual.itens.length > 0) {
              this.carregarDetalhesProdutos(this.pedidoAtual.itens);
            }
            this.adicionarItensSelecionados();
            this.atualizarValorTotal(this.pedidoAtual);
          });
          this.pedidoService.pedidoAtual$.subscribe((pedido) => {
            if (pedido) {
              this.pedidoAtual = pedido;
              console.log('Pedido atualizado pelo serviço:', this.pedidoAtual);
            }
          });
          }
        private adicionarItensSelecionados(): void {
          this.itensSelecionados = this.pedidoDataService.getItensSelecionados();
          console.log('Itens selecionados recebidos no Pedido:', this.itensSelecionados);
        
          if (this.itensSelecionados && this.itensSelecionados.length > 0) {
            this.pedidoAtual.itens = [...(this.pedidoAtual.itens || []), ...this.itensSelecionados];
            console.log('Pedido atualizado com novos itens:', this.pedidoAtual);
            this.pedidoDataService.clearItensSelecionados();
          }
        }
        private atualizarValorTotal(pedido: Pedido): void {
          if (pedido.itens && pedido.itens.length > 0) {
            pedido.valorTotal = pedido.itens.reduce((total, item) => {
              const preco = parseFloat(item.preco_unitario ? String(item.preco_unitario) : '0');
              const quantidade = item.quantidade || 0; 
              return total + preco * quantidade;
            }, 0);
            console.log('Valor total atualizado:', pedido.valorTotal);
          } else {
            pedido.valorTotal = 0;
          }
        }
        private carregarDetalhesProdutos(itens: ItemPedido[]): void {
          itens.forEach((item) => {
            if (!item.produtoId) {
              return;
            }
            this.produtoService.buscarPorId(item.produtoId).subscribe(
              (produto) => {
                item.produto = produto; 
                this.pedidoDataService.setItensSelecionados(itens);
              },
              (error) => {
                console.error('Erro ao carregar produto com ID:', item.produtoId, error);
              }
            );
          });
        }
        
atualizarPedido(): void {
  if (this.pedidoAtual && this.pedidoAtual.id) {
    const itensAtualizados = this.pedidoAtual.itens?.map(item => {
      return {
        ...item,
        preco_unitario: item.preco_unitario, 
        produtoId: item.produto!.id,
      };
    }) || [];

    const pedidoAtualizado: Pedido = {
      ...this.pedidoAtual,
      itens: itensAtualizados, 
    };

    console.log('Enviando pedido atualizado ao backend:', pedidoAtualizado);

    this.pedidoService.atualizarPedido(this.pedidoAtual.id, pedidoAtualizado).subscribe(
      (response) => {
        console.log('Pedido atualizado com sucesso!', response);
        this.router.navigate(['/pedidos', this.pedidoAtual.id]);
      },
      (error) => {
        console.error('Erro ao atualizar pedido:', error);
      }
    );
  } else {
    console.error('Pedido não encontrado ou sem itens selecionados.');
  }
}



atualizarQuantidadeTotal(pedido: Pedido): void {
  const quantidadeTotal = pedido.itens!.reduce((total, item) => total + item.quantidade!, 0);
  pedido.quantidade = quantidadeTotal; 
}
  
adicionarNovosItens(novosItens: any[]): void {
const itensValidos = novosItens.filter((item) => item.quantidade > 0);
const itensExistentes = Array.isArray(this.pedidoAtual?.itens) ? this.pedidoAtual.itens : [];
const itensDuplicados = itensValidos.filter((novoItem) =>
  itensExistentes.some((item) => item.produtoId === novoItem.produtoId)
);
if (itensValidos.length === 0) {
  alert('Nenhum item válido foi adicionado.');
  return;
}
if (itensDuplicados.length > 0) {
  alert('Itens duplicados detectados: ' + itensDuplicados.map((i) => i.produtoId).join(', '));
  return;
}

this.cdr.detectChanges();
if (!this.pedidoAtual) {
  this.pedidoAtual = { itens: [] };  
}
if (Array.isArray(this.pedidoAtual.itens)) {
  this.pedidoAtual.itens = [...this.pedidoAtual.itens, ...itensValidos];
  this.atualizarValorTotal(this.pedidoAtual);  
  this.cdr.detectChanges();
} else {
  this.pedidoAtual.itens = itensValidos;
  this.atualizarValorTotal(this.pedidoAtual); 
  
}
}


carregarPedido(pedidoId: number): void {
this.pedidoService.getPedidoById(pedidoId).subscribe(
  (pedido) => {
    if (pedido) {
      this.pedido = pedido;
    } else {
      this.router.navigate(['/erro'], { queryParams: { mensagem: 'Pedido não encontrado' } });
    }
  },
  (erro) => {
    console.error('Erro ao carregar pedido:', erro);
    this.router.navigate(['/erro'], { queryParams: { mensagem: 'Erro ao carregar pedido' } });
  }
  
);

}

erroQuantidade: string = '';

validarQuantidade(item: any): void {
  if (item.quantidade < 1) {
    this.erroQuantidade = 'A quantidade deve ser pelo menos 1.';
  } else if (item.quantidade > 100) {
    this.erroQuantidade = 'A quantidade máxima permitida é 100.';
  } else {
    this.erroQuantidade = '';
  }
}


irParaItemPedido(): void {
  if (this.pedidoAtual && this.pedidoAtual.id) {
    console.log(this.pedidoAtual.id)
    this.pedidoService.setPedidoAtual(this.pedidoAtual);
    this.router.navigate(['/item-Pedido/pedido/', this.pedidoAtual.id]);
  } else {
    console.error('Pedido atual ou ID do pedido não está definido.');
  }
}

  
onQuantidadeChange(item: any): void {
  if (item.quantidade < 1) {
    item.quantidade = 1; 
  }
  this.atualizarValorTotal(this.pedido);
  item.subtotal = item.quantidade * item.preco_unitario;
this.atualizarValoresPedido();

}
 
atualizarValoresPedido(): void {
  this.pedidoAtual.quantidade = this.pedidoAtual.itens!.reduce((sum, i) => sum + i.quantidade!, 0);
  this.pedidoAtual.valorTotal = this.pedidoAtual.itens!.reduce((sum, i) => sum + i.quantidade! * i.preco_unitario!, 0);
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

removerProduto(produtoId: number): void {
  this.pedidoService.removerItem(this.pedido.id!, produtoId).subscribe(
    () => {
      this.pedido.itens = this.pedido.itens!.filter((item) => item.produtoId !== produtoId);
      this.atualizarValorTotal(this.pedidoAtual);
    },
    (erro) => {
      console.error('Erro ao remover produto:', erro);
      alert('Erro ao remover produto.');
    }
  );
}
    
 


}
