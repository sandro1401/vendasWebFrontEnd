import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';
import { Router } from '@angular/router';
import { UsuarioApiService } from '../service/usuario-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  nomeUsuario: string = '';
  logado: boolean = false;
  private loginSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private usuarioApiService: UsuarioApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }
  
  ngOnInit(): void {
    
    this.loginSubscription = this.authService.getEstadoLogado().subscribe((logado) => {
      this.logado = logado;
      if (logado) {
        this.nomeUsuario = this.usuarioApiService.getUsuarioNome() || 'Usuário';
      } else {
        this.nomeUsuario = '';
      }
    });
  }

  carregarNomeUsuario(): void {
    if (this.authService.logado()) {
      this.nomeUsuario = this.usuarioApiService.getUsuarioNome() || 'Usuário';
    }
  }
  atualizarUsuario(): void {
    const usuarioNome = this.usuarioApiService.getUsuarioNome();
    if (usuarioNome) {
      this.nomeUsuario = usuarioNome;
    }
  }
  logout(): void {
    this.usuarioApiService.logout();
    this.router.navigate(['']).then(() => {
      window.location.reload();
    });
  }
  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe(); 
    }
  }
}
