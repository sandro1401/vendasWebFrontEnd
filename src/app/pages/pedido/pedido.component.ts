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
  ) 
    {
      this.activatedRoute.queryParams.subscribe(params =>{
        this.pedido.produtoId = parseInt(params['produtoId'])
        this.pedido.usuarioId = params['usuarioId'];})}

  ngOnInit(): void {

    const pedidoId = this.activatedRoute.snapshot.params['id']; 
    this.pedidoService.getPedidoById(pedidoId).subscribe((pedido) => {
      this.pedidoAtual = pedido;
    });
    this.activatedRoute.params.subscribe((params) => {
      this.pedidoId = +params['id'];
      if (!this.pedidoId) {
        console.error('Erro: pedidoId está nulo ou inválido!');
        return;
      }    this.carregarPedido(this.pedidoId);
    });
    this.itensSelecionados = this.pedidoDataService.getItensSelecionados();
    console.log('Itens selecionados recebidos no Pedido:', this.itensSelecionados);
    
    const novosItens = this.pedidoDataService.getItensSelecionados();
    if (novosItens && novosItens.length > 0) {
      this.adicionarNovosItens(novosItens);
      this.pedidoDataService.clearItensSelecionados(); 
    }
    this.pedidoAtual$.subscribe(() =>{
      this.atualizarValorTotal(this.pedidoAtual)
    })

    this.pedidoService.pedidoAtual$.subscribe((pedido) => {
      if (pedido) {
        this.pedidoAtual = pedido;
      }})

  }


  atualizarPedido(): void {
    if (this.pedidoAtual && this.pedidoAtual.id ) {
      const pedidoAtualizado: Pedido = {
        ...this.pedidoAtual,
        itens: [...this.pedidoAtual.itens!, ...this.itensSelecionados] 
      };
      this.atualizarQuantidadeTotal(pedidoAtualizado);
      this.atualizarValorTotal(pedidoAtualizado);
      this.pedidoService.atualizarPedido(this.pedidoId, pedidoAtualizado).subscribe(
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
    pedido.quantidade = quantidadeTotal; // Atualiza a quantidade total no pedido
  }
  
  atualizarValorTotal(pedido: Pedido): void {
    const valorTotal = pedido.itens!.reduce((total, item) => total + item.preco_unitario! * item.quantidade!, 0);
    pedido.valorTotal = valorTotal; // Atualiza o valor total no pedido
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
  console.log('Itens válidos:', itensValidos);
  console.log('Itens duplicados:', itensDuplicados);
  this.cdr.detectChanges();
  if (!this.pedidoAtual) {
    this.pedidoAtual = { itens: [] };  
  }
  if (Array.isArray(this.pedidoAtual.itens)) {
    // this.pedidoAtual.itens.push(...itensValidos); 
    this.pedidoAtual.itens = [...this.pedidoAtual.itens, ...itensValidos];
    this.atualizarValorTotal(this.pedidoAtual);  
    console.log(this.pedidoAtual.itens)
    this.cdr.detectChanges();
  } else {
    this.pedidoAtual.itens = itensValidos;
    this.atualizarValorTotal(this.pedidoAtual); 
    
  }
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
          this.pedidoAtual = {
            ...this.pedidoAtual,
            itens: [...(this.pedidoAtual.itens || []), itemPedido],
          };
          this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao adicionar item:', err)
  });
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

// salvarAlteracoes(): void {
//   if (!this.pedido.id) {
//     alert('O ID do pedido é inválido.');
//     return;
//   }
//   this.cdr.detectChanges();
//   this.pedidoService.atualizarPedido(this.pedido.id, this.pedido).subscribe(
//     () => {
//       alert('Alterações salvas com sucesso!');
//       this.carregarPedido(this.pedido.id!); 
//     },
//     (erro) => {
//       console.error('Erro ao salvar alterações:', erro);
//       alert('Erro ao salvar alterações. Por favor, tente novamente.');
//     }
//   );

// }


// descartarAlteracoes(): void {
//   this.carregarPedido(this.pedido.id!); 
// }


 
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
