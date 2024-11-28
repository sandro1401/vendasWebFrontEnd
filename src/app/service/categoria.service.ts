import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria';

// const BASE_API = 'http://localhost:3000/api/categoria';
const BASE_API = 'https://vendaswebbackend.onrender.com/api/categoria'

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient) {}

  listar():Observable<Categoria[]>{
    return this.http.get<Categoria[]>(BASE_API);
  }
    buscarPorId(id: number): Observable<Categoria> {
      const uri = `${BASE_API}/${id}`;
      return this.http.get<Categoria>(uri);
    }
    inserir(categoria:Categoria): Observable<Categoria> {
      return this.http.post(BASE_API, categoria, httpOptions);
    }
  
    editar(id: number, categoria:Categoria): Observable<Categoria> {
      const uri = `${BASE_API}/${id}`;
      return this.http.put<Categoria>(uri,categoria,httpOptions);
    }
    deletar(id: number): Observable<Categoria> {
      const uri = `${BASE_API}/${id}`;
      return this.http.delete<Categoria>(uri);
    }
}
