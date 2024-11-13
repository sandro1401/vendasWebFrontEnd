import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto';

const BASE_API = 'http://localhost:3000/api/produto';
const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoApiService {

  constructor(private http: HttpClient) {}

  listar():Observable<Produto[]>{
    return this.http.get<Produto[]>(BASE_API);
  }
    buscarPorId(id: number): Observable<Produto> {
      const uri = `${BASE_API}/${id}`;
      return this.http.get<Produto>(uri);
    }
    inserir(produto: Produto): Observable<Produto> {
      return this.http.post(BASE_API, produto, httpOptions);
    }
    // inserir(formData: FormData): Observable<any> {
    //   const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });
    //   return this.http.post(BASE_API,formData, { headers: headers });
    // }
  
    editar(id: number, produto:Produto): Observable<Produto> {
      const uri = `${BASE_API}/${id}`;
      return this.http.put<Produto>(uri,produto,httpOptions);
    }
    editarImagemProduto(id: any, formData: FormData): Observable<any> {
      const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });
      return this.http.put(`${BASE_API}/imagens-prod/${id}`, formData, { headers: headers })
    }
  
    deletar(id: number): Observable<Produto> {
      const uri = `${BASE_API}/${id}`;
      return this.http.delete<Produto>(uri);
    }
    obterProdutos(): Observable<Produto[]> {
      return this.http.get<Produto[]>(BASE_API);
    }
    inserirComImagem(produtoData: FormData):Observable<any> {
      const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });
      return this.http.post(BASE_API, produtoData, { headers: headers });
    }
    
    editarComImagem(id: number, produtoData: FormData) {
      return this.http.put(`${BASE_API}/${id}`, produtoData, httpOptions);
    }
    getUsuarioId(): any {
      const usuarioId = sessionStorage.getItem('usuario.id');
      return usuarioId;
    }
}
