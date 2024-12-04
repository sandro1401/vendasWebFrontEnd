import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

// const BASE_API = 'http://localhost:3000/api/usuario';
const BASE_API = 'https://vendaswebbackend.onrender.com/api/usuario'
const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioApiService {

  getUsuarioNome(): any {
    const nomeUsuario = sessionStorage.getItem('usuario.nome') ;
    return nomeUsuario;
  }
  getUsuarioId(): any {
    const usuarioId = sessionStorage.getItem('usuario.id');
    return usuarioId;
  }
  
  logout() {
    sessionStorage.removeItem('usuario.nome');
    sessionStorage.removeItem('usuario.id');
  }

  constructor(private http: HttpClient) {}

  listar():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(BASE_API);
  }
    buscarPorId(id: number): Observable<Usuario> {
      const uri = `${BASE_API}/${id}`;
      return this.http.get<Usuario>(uri);
    }
   
    login(email: string, senha: string): Observable<any> {
      return this.http.get<any>(`${BASE_API}/email/${email}`)
      .pipe(
        catchError(error => {
          throw error;
        })
      )
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

