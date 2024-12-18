import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, catchError } from 'rxjs';
import { Produto } from '../models/produto';
import { Pedido } from '../models/pedido';
import { throwError } from 'rxjs';
import { ItemPedido } from '../models/item-pedido';
import { Usuario } from '../models/usuario';

// const BASE_API = 'http://localhost:3000/api/pedido';
const BASE_API = 'https://vendaswebbackend.onrender.com/api/pedido'
const BASE_API_itens = 'https://vendaswebbackend.onrender.com/api/itemPedido';

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
  private pedidoSource = new BehaviorSubject<any>(null);
  pedidoAtual$ = this.pedidoSource.asObservable();

  setPedidoAtual(pedido: any): void {
    this.pedidoSource.next(pedido);
  }

  listarPedido(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(BASE_API).pipe(
      map((pedidos: any[]) =>
        pedidos.map((pedido) => ({
          ...pedido,
          usuarioId: pedido.usuarioid,       // Mapeia `usuarioid` para `usuarioId`
          produtoId: pedido.produtoid,       // Mapeia `produtoid` para `produtoId`
          quantidade: pedido.quantidade,     // Confere se `quantidade` está correto
          valorTotal: pedido.valortotal,     // Mapeia `valortotal` para `valorTotal`
          data_Pedido: new Date(pedido.data_pedido), // Mapeia e transforma `data_pedido` para Date
        }))
      )
    );
  }
  
  

  getPedidoAtual(): any {
    return this.pedidoSource.getValue();
  }

  
  constructor(private http: HttpClient) { }


  /**
   * Adiciona um produto ao pedido localmente e envia a requisição para o backend.
   * @param produto Produto a ser adicionado
   * @returns Observable com o produto adicionado pelo backend
   */

  atualizarPedido(id: number, pedidoAtualizado: Pedido): Observable<Pedido> {
    console.log('Enviando pedido atualizado ao backend:', pedidoAtualizado); 
    return this.http.put<Pedido>(`${BASE_API}/${id}`, pedidoAtualizado, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

 
  
  criarPedido(pedido: any): Observable<Pedido> {
    return this.http.post(`${BASE_API}`, pedido).pipe(
      tap((pedidoCriado: any) =>{
        this._pedidoId.next(pedidoCriado.id)
      })
    );
  }

  getPedidoById(id: number): Observable<Pedido>{
    return this.http.get(`${BASE_API}/${id}`).pipe(
      map((pedido: any) => ({
        ...pedido,
        data_Pedido: new Date(pedido.data_pedido),
        valorTotal: pedido.valortotal,
        produtoId: pedido.produtoid,
        usuarioId: pedido.usuarioid,
        itens: pedido.itens || [] 
      })) )
    
  }

  adicionarItensAoPedido(pedidoId: number, itens: ItemPedido[]): Observable<any> {
    return this.http.put(`${BASE_API}/${pedidoId}`, { itens });
  }
  atualizarItemPedido(itemPedidoId: number, item: ItemPedido): Observable<any> {
    return this.http.put(`${BASE_API_itens}/${itemPedidoId}`, item);
  }

  adicionarProdutoPedido(produto: Produto, quantidade: number, pedidoId: number, concluido: boolean = false): Observable<ItemPedido> {
    const body: ItemPedido = {
      produtoId: produto.id,
      quantidade,
      pedidoId,
      concluido,
      preco_unitario: produto.preco, 
    };

    return this.http.post<ItemPedido>(`${BASE_API_itens}/${pedidoId}`, body);
  }

  getItensPedidoByPedidoId(pedidoId: number) {
    return this.http.get<ItemPedido[]>(`${BASE_API_itens}/pedido/${pedidoId}`);
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
  removerItem(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE_API_itens}/${id}/`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
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



  deletar(id: number): Observable<Pedido> {
    const uri = `${BASE_API}/${id}`;
    return this.http.delete<Pedido>(uri);
  }

  
}