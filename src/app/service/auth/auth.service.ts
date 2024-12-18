import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../../models/usuario'; 
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode';

// const BASE_API = "http://localhost:3000/api/login";
const BASE_API = 'https://vendaswebbackend.onrender.com/api/login'
const BASE_API_usuario = 'https://vendaswebbackend.onrender.com/api/usuario'
// const BASE_API_usuario = "http://localhost:3000/api/usuario";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
}
const TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private logadoSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.logado());
  
  constructor(private http: HttpClient) { }
  
  login(usuario: Usuario): Observable<boolean> {
    return this.http.post<any>(BASE_API, usuario, httpOptions).pipe(
      tap((resp: any) => {
        if(resp && resp?.token){
          sessionStorage.setItem("token", resp.token);
          const decodedToken: any = jwtDecode(resp.token);
        sessionStorage.setItem("usuario.id", decodedToken.id);
        sessionStorage.setItem("usuario.nome", decodedToken.nome);
        sessionStorage.setItem("usuario.email", decodedToken.email);
        sessionStorage.setItem("usuario.tipo", decodedToken.tipo);
        
          return true;
          
        }
        else {
          return false;
        }
      }),
      catchError(error => {
        console.error('Erro ao realizar login:', error);
        return of(false);
      }));
  }
  
logado(): boolean {
  return !!sessionStorage.getItem('usuario.nome');
}

estaLogado(): boolean {
  const token = sessionStorage.getItem("token");
  return token != null;
}

  
  setUsuarioLogado(nome: string): void {
    sessionStorage.setItem('usuario.nome', nome);
    this.logadoSubject.next(true); 
  }
  logout(): void {
    sessionStorage.clear(); 
    sessionStorage.removeItem('token')
  }

  obterTipoUsuario(): string | null {
    const tipo = sessionStorage.getItem('usuario.tipo');
    return tipo ? tipo : null;
  }

  obterUsuario(): string | null {
    const user = sessionStorage.getItem('usuario');
    return user ? user : null;
  }
  
  ehAdmin(): boolean {
    return this.obterTipoUsuario() === 'admin';
  }
  
  ehCliente(): boolean {
    return this.obterTipoUsuario() === 'cliente';
  }

  getEstadoLogado(): Observable<boolean> {
    return this.logadoSubject.asObservable(); 
  }
 


  obterUsuarioLogado(): Observable<Usuario> {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }

    try {
      const decodedToken: any = jwtDecode(token);

      if (!decodedToken || !decodedToken.id || !decodedToken.nome) {
        throw new Error('Dados do usuário não encontrados no token');
      }

      const usuario: Usuario = {
        id: decodedToken.id,
        nome: decodedToken.nome,
        email: decodedToken.email || '', 
      };
      return of(usuario); 

    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      throw error;
    }
  }
}



