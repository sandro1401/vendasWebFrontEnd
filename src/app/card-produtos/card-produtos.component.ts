import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-produtos',
  templateUrl: './card-produtos.component.html',
  styleUrl: './card-produtos.component.css'
})
export class CardProdutosComponent {
  @Input() produto: any;
  
  constructor(private router: Router){}
  
  comprar() {
    this.router.navigate(['/listaProdutos']);
  }
}
