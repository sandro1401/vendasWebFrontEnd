import { Component } from '@angular/core';
import { ProdutoApiService } from '../../service/produto-api.service';
import { Produto } from '../../models/produto';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-produtos',
  templateUrl: './lista-produtos.component.html',
  styleUrl: './lista-produtos.component.css'
})
export class ListaProdutosComponent {
  listaProdutos: Produto[] = []; 
  pesquisarProduto = ' ';
  constructor(private produtoApiService: ProdutoApiService,
    private router: Router,
  ) {
    this.listar();
  }
  listar() {
    this.produtoApiService.listar().subscribe({
      next: (produtos) => {
        if (produtos.length === 0) {
          alert("Nenhum produto encontrado.");
        } else {
          this.listaProdutos = produtos;
        }
      },
      error: (err) => {
        if (err.status === 404) {
          alert("Nenhum produto encontrado no sistema.");
          this.router.navigate(['']);
        } else {
          alert("Erro ao buscar os produtos. Tente novamente mais tarde.");
          console.error(err); 
        }
      }
    });
  }
  
  deletar(id?: number) {
    this.produtoApiService.deletar(id!).subscribe({
      next: () => {
        alert("Produto deletado com sucesso!");
        this.listar(); // Atualiza a lista de produtos após a exclusão
      },
      error: (err) => {
        if (err.status === 500) {
          alert("Não é possível deletar este produto. Ele está associado a um pedido.");
        } else {
          alert("Erro ao deletar produto.");
        }
      }
    });
  }
  
}
