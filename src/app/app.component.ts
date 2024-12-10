import { Component, OnInit } from '@angular/core';
import { AuthService } from './service/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'vendasWeb';
  estaLogado: boolean = false;
  logado: boolean =false;

  constructor(public authService: AuthService,
    private router: Router,
  ){
    this.verificarLogin()
    
  }

  ngOnInit(): void {
    this.authService.getEstadoLogado().subscribe((logado) => {
      this.logado = logado;
      // console.log(logado)
    });
  }

  verificarLogado(): void{
    this.logado = this.authService.logado();
  }
  
  verificarLogin(): void {
    this.estaLogado = this.authService.estaLogado();
  }
    

  logout(): void {
    this.authService.logout();
    this.estaLogado = false
    this.router.navigate(['']);
  }
}
