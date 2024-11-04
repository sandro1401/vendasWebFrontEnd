import { Component } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { AuthService } from '../../service/auth/auth.service';
import { Router } from '@angular/router';
import { UsuarioApiService } from '../../service/usuario-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
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
   ){}

   listarUsuarios() {
    this.usuarioApiService.listar().subscribe(
      usuarios => {
        console.log("USUARIOS: ", usuarios)
      }
    )
  }

  login(email: string, senha: string) {
    this.usuarioApiService.login(email, senha).subscribe(
      usuario => {
        if(usuario && senha) {
          if(usuario.senha === senha) {
            this.realizarLogin(usuario.nome)
            sessionStorage.setItem('usuario.nome', usuario.nome);
            sessionStorage.setItem('usuario.id', usuario.id);
         
            
            this.router.navigate(['/listaProdutos'])
              .then( () => {
                window.location.reload()
              });
          } else {
            this.errorMessage = 'Email ou senha incorreto!';
          }
        } else {
          this.errorMessage = 'Faltou digitar a senha!';
        }
      },
      error => {
        this.errorMessage = 'Email ou senha incorreto!';
      }
    )
  }

  // Método para limpar a mensagem de erro
  clearErrorMessage() {
    this.errorMessage = '';
  }
  realizarLogin(nome: string) {
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
  


