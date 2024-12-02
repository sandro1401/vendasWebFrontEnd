import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../../models/usuario'; 
import { Observable, of } from 'rxjs';
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

  constructor(private http: HttpClient) { }
  
  login(usuario: Usuario): Observable<boolean> {
    return this.http.post<any>(BASE_API, usuario, httpOptions).pipe(
      tap((resp: any) => {
        if(resp && resp?.token){
          sessionStorage.setItem("token", resp.token);
          const decodedToken: any = jwtDecode(resp.token);
          console.log("Token decodificado:", decodedToken);

    
        sessionStorage.setItem("usuario.id", decodedToken.id);
        sessionStorage.setItem("usuario.nome", decodedToken.nome);
        sessionStorage.setItem("usuario.email", decodedToken.email);
          return true;
          
        }
        else {
          return false;
        }
      }),
      catchError(error => of(false))      
    );    
  }

  estaLogado(): boolean {
    const token = sessionStorage.getItem("token");
    return token != null;
  }

  logout() {
    localStorage.removeItem('token');
  }

 
  obterUsuarioLogado(): Observable<Usuario> {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.get<Usuario>(`${BASE_API_usuario}`, { headers }).pipe(
      tap((usuario: Usuario) => {
        if (!usuario || !usuario.id || !usuario.nome) {
          throw new Error('Dados do usuário não encontrados na resposta');
        }else{
          console.log('Usuário logado:', usuario.nome, usuario.id);
        }
       
     
      
      }),
      catchError((error) => {
        console.error('Erro ao obter usuário logado:', error);
        throw error;
      })
    );
  }
}
