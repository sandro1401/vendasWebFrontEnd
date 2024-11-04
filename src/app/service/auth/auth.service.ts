import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../../models/usuario'; 
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';


const BASE_API = "http://localhost:3000/api/login";
const BASE_API_usuario = "http://localhost:3000/api/usuario";
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

    return this.http.get<Usuario>(`${BASE_API}`, { headers }).pipe(
      tap((usuario: Usuario) => {
        // Você pode armazenar o usuário logado em uma variável aqui, se necessário
        return usuario;
      })
    );
  }
}
