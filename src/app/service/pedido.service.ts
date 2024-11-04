import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, catchError } from 'rxjs';
import { Produto } from '../models/produto';
import { throwError } from 'rxjs';
import { ItemPedido } from '../models/item-pedido';

const BASE_API = 'http://localhost:3000/api/pedido';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private itensPedido = new BehaviorSubject<Produto[]>([]);
  itensPedido$ = this.itensPedido.asObservable();
  
  private _pedidoId = new BehaviorSubject<number | null>(null);
  pedidoId$ = this._pedidoId.asObservable();
  
  constructor(private http: HttpClient) { }

  /**
   * Adiciona um produto ao pedido localmente e envia a requisição para o backend.
   * @param produto Produto a ser adicionado
   * @returns Observable com o produto adicionado pelo backend
   */

  criarPedidoVazio(): Observable<any> {
    return this.http.post(BASE_API, {});
  }
  
  adicionarProduto(produto: Produto, quantidade: number, pedidoId: number, concluido: boolean = false): Observable<ItemPedido> {
    const body: ItemPedido = {
      produtoId: produto.id,
      quantidade,
      pedidoId,
      concluido,
      // Valor total pode ser calculado aqui ou no servidor, dependendo da sua implementação
      // valorTotal: produto.preco * quantidade, // Descomente se deseja calcular aqui
    };
  
    return this.http.post(`${BASE_API}`, body, httpOptions).pipe(
      tap((response: ItemPedido) => {
        console.log('Item de pedido criado com sucesso:', response);
        return response; // Retorne o item de pedido completo
      }),
      catchError((error) => {
        console.error('Erro ao adicionar produto ao pedido:', error);
        return throwError(() => error);
      })
    );
  }
   
    ;
  

		

  /**
   * Remove um produto do pedido localmente e envia a requisição para o backend.
   * @param produtoId ID do produto a ser removido
   * @returns Observable com a resposta do backend após remoção
   */
  removerProduto(produtoId: number): Observable<any> {
    // Primeiro, atualiza a lista local de itens do pedido
    const itensAtuais = this.itensPedido.getValue();
    const itensAtualizados = itensAtuais.filter(p => p.id!== produtoId);
    this.itensPedido.next(itensAtualizados);

    // Envia a requisição para remover o produto do backend
    return this.http.delete(`${BASE_API}/${produtoId}`, httpOptions).pipe(
      catchError((error) => {
        // Tratamento de erro, caso a requisição falhe
        console.error('Erro ao remover produto:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtem todos os itens do pedido do backend e atualiza a lista local.
   * @returns Observable com a lista de produtos
   */
  obterItensPedido(): Observable<Produto[]> {
    return this.http.get<Produto[]>(BASE_API).pipe(
      tap((itensDoPedido: Produto[]) => {
        // Atualiza a lista local de itens do pedido após obter do backend
        this.itensPedido.next(itensDoPedido);
      }),
      catchError((error) => {
        // Tratamento de erro, caso a requisição falhe
        console.error('Erro ao obter itens do pedido:', error);
        return throwError(() => error);
      })
    );
  }

  // Método adicional para sincronizar a lista local com o backend (opcional)
  sincronizarItensPedido(): Observable<Produto[]> {
    return this.obterItensPedido();
  }

  criarPedido(pedido: any): Observable<any> {
    return this.http.post(`${BASE_API}`, pedido).pipe(
      tap((pedidoCriado: any) =>{
        this._pedidoId.next(pedidoCriado.id)
      })
    );
  }

  adicionarItemPedido(itemPedido: any) {
    return this.http.post(`${BASE_API}`, itemPedido);
  }

  getPedidoById(id: number): Observable<any>{
    return this.http.get(`${BASE_API}/${id}`,)
  }
}