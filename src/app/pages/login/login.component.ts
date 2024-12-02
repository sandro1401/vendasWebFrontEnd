import { Component } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { AuthService } from '../../service/auth/auth.service';
import { Router } from '@angular/router';
import { UsuarioApiService } from '../../service/usuario-api.service';
import { OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { Auth, signOut,  signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isAuth = false;
  erro = false;
  usuario = new Usuario();

  hidePassword = true;
 nome: string = '';
  email: string = '';
  senha: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private usuarioApiService: UsuarioApiService,
    private auth: Auth
   ){
    if(localStorage.getItem("token"))  
      this.isAuth = true;
   }



  login(email: string, senha: string) {
    this.usuarioApiService.login(email, senha).subscribe(
      usuario => {
        if(usuario && senha) {
          if(usuario.senha === senha) {
            this.usuario = usuario;
            this.realizarLogin()
           
          }

        }
      }
    )
  }

  

  // Método para limpar a mensagem de erro
  clearErrorMessage() {
    this.errorMessage = '';
  }

 
  realizarLogin() {
    console.log(this.usuario)
    this.authService.login(this.usuario).subscribe(
      logado => {
        if(logado) {
          this.router.navigate(['']);
        }
        else {
          this.erro = true;
        }
      }
    )    
  }
}
  


