import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const BASE_API = 'http://localhost:3000/api/usuario';
const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioApiService {

  constructor(private http: HttpClient) {}

  listar():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(BASE_API);
  }
    buscarPorId(id: number): Observable<Usuario> {
      const uri = `${BASE_API}/${id}`;
      return this.http.get<Usuario>(uri);
    }
  
    inserir(usuario: Usuario): Observable<Usuario> {
      return this.http.post(BASE_API, usuario, httpOptions);
    }
  
    editar(id: number, usuario:Usuario): Observable<Usuario> {
      const uri = `${BASE_API}/${id}`;
      return this.http.put<Usuario>(uri,usuario,httpOptions);
    }
  
    deletar(id: number): Observable<Usuario> {
      const uri = `${BASE_API}/${id}`;
      return this.http.delete<Usuario>(uri);
    }
  }

