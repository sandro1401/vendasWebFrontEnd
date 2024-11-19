import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ItemPedido } from '../models/item-pedido';
import { ProdutoApiService } from './produto-api.service';
import { forkJoin } from 'rxjs';
import { Observable } from 'rxjs'; 
import { Produto } from '../models/produto';

@Injectable({
  providedIn: 'root'
})
export class PedidoDataService {
  private itensSelecionadosSource = new BehaviorSubject<ItemPedido[]>([]);
  itensSelecionados$ = this.itensSelecionadosSource.asObservable();

  constructor(private produtoService: ProdutoApiService) { }

  // Método para adicionar produtos aos itens
  adicionarProdutoAosItens(itens: ItemPedido[]): void {
    // Cria uma lista de observables para as requisições dos produtos
    const produtos$ = itens.map(item => {
      if (!item.produto) { // Só busca o produto se não estiver preenchido
        return this.produtoService.buscarPorId(item.produtoId!);
      } else {
        // Se o produto já estiver preenchido, retorna um Observable com o produto já presente
        return new Observable<Produto>(observer => {
          observer.next(item.produto);
          observer.complete();
        });
      }
    });

    // Espera todas as requisições de produtos terminarem
    forkJoin(produtos$).subscribe((produtos) => {
      // Atualiza os itens com os produtos encontrados
      const itensComProduto = itens.map((item, index) => ({
        ...item,
        produto: produtos[index] || item.produto || { id: item.produtoId, nome: 'Produto não encontrado' }
      }));
      this.itensSelecionadosSource.next(itensComProduto);
    });
  }
  // Método para definir os itens selecionados
  setItensSelecionados(itens: ItemPedido[]): void {
    this.adicionarProdutoAosItens(itens);
  }

  getItensSelecionados(): ItemPedido[] {
    return this.itensSelecionadosSource.getValue();
  }

  clearItensSelecionados() {
    this.itensSelecionadosSource.next([]);
  }
}






// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { ItemPedido } from '../models/item-pedido';

// @Injectable({
//   providedIn: 'root'
// })
// export class PedidoDataService {
//   private itensSelecionadosSource = new BehaviorSubject<ItemPedido[]>([]);
//   itensSelecionados$ = this.itensSelecionadosSource.asObservable();

//   setItensSelecionados(itens: ItemPedido[]) {
//     this.itensSelecionadosSource.next(itens);
//   }

//   getItensSelecionados(): ItemPedido[] {
//     return this.itensSelecionadosSource.getValue();
//   }

//   clearItensSelecionados() {
//     this.itensSelecionadosSource.next([]);
//   }

//   constructor() { }
// }
