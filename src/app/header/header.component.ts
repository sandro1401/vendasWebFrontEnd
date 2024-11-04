import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';
import { Usuario } from '../models/usuario';
  import { Router } from '@angular/router';
  import { UsuarioApiService } from '../service/usuario-api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent  {

  
  nomeUsuario = ' ';
  idUsuario = ';'
  constructor(private authService: AuthService,  private router: Router, 
    private usuarioApiService: UsuarioApiService) { 
      this.nomeUsuario = this.usuarioApiService.getUsuarioNome();
      this.idUsuario = this.usuarioApiService.getUsuarioId();
    }
    logout() {
      this.usuarioApiService.logout();
      this.router.navigate([''])
        .then( () => {
          window.location.reload()
        });
    }
 
  }
 