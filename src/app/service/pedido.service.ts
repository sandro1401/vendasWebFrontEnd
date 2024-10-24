import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, catchError } from 'rxjs';
import { Produto } from '../models/produto';
import { throwError } from 'rxjs';

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
  
  adicionarProduto(produto: Produto): Observable<Produto> {
    // Primeiro, envia a requisição para o backend para adicionar o produto
    return this.http.post<Produto>(`${BASE_API}`, { produto }, httpOptions).pipe(
      tap((produtoAdicionado: Produto) => {
        // Após sucesso, atualiza a lista local de itens do pedido
        const itensAtuais = this.itensPedido.getValue();
        itensAtuais.push(produtoAdicionado);
        this.itensPedido.next(itensAtuais);
      }),
      catchError((error) => {
        // Tratamento de erro, caso a requisição falhe
        console.error('Erro ao adicionar produto:', error);
        return throwError(() => error);
      })
    );
  }

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
}