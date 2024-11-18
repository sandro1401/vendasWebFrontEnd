import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-erro',
  templateUrl: './erro.component.html',
  styleUrl: './erro.component.css'
})
export class ErroComponent {
  mensagemErro: string = '';

constructor(private route: ActivatedRoute) {}

ngOnInit(): void {
  this.route.queryParams.subscribe((params) => {
    this.mensagemErro = params['mensagem'] || 'Erro desconhecido';
  });
}

}
