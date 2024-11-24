import { Component, Input } from '@angular/core';
import { Produto } from '../../models/produto';
import { ProdutoApiService } from '../../service/produto-api.service';
@Component({
  selector: 'app-list-card-produtos',
  templateUrl: './list-card-produtos.component.html',
  styleUrl: './list-card-produtos.component.css'
})
export class ListCardProdutosComponent {
  listaProdutos: Produto[] = []; 
  pesquisarProduto = ' ';

  constructor(private produtoApiService: ProdutoApiService,
    
  ) {
    this.listar();
  }
  listar(){
    this.produtoApiService.listar().subscribe(
      (produtos) => {
        this.listaProdutos = produtos;
      }
    )
  }



}
