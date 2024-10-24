import { Component } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { AuthService } from '../../service/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  erro = false;
  usuario = new Usuario()

  constructor(
    private authService: AuthService,
    private router: Router
   ){}
   realizarLogin() {
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
