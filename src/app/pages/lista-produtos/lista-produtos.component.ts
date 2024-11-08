import { Component } from '@angular/core';
import { ProdutoApiService } from '../../service/produto-api.service';
import { Produto } from '../../models/produto';

@Component({
  selector: 'app-lista-produtos',
  templateUrl: './lista-produtos.component.html',
  styleUrl: './lista-produtos.component.css'
})
export class ListaProdutosComponent {
  listaProdutos: Produto[] = []; 
  pesquisarProduto = ' ';
  constructor(private produtoApiService: ProdutoApiService) {
    this.listar();
  }
  listar(){
    this.produtoApiService.listar().subscribe(
      (produtos) => {
        this.listaProdutos = produtos;
      }
    )
  }
  deletar(id?: number){
    this.produtoApiService.deletar(id!).subscribe(
      (produto) =>{
        alert("Produto Deletado Com Sucesso");
        this.listar();
      }
    )
  }
}
