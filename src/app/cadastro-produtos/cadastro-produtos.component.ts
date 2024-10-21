import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Produto } from '../produto';
import { ProdutoApiService } from '../produto-api.service';

@Component({
  selector: 'app-cadastro-produtos',
  templateUrl: './cadastro-produtos.component.html',
  styleUrl: './cadastro-produtos.component.css'
})
export class CadastroProdutosComponent {
  produto = new Produto();
  id?:number;
  botaoAcao = "CADASTRAR";
  
  constructor(
    private produtoApiService: ProdutoApiService,
    private router: Router,
    private route: ActivatedRoute
    ) {
      this.id = +this.route.snapshot.params['id'];
      if(this.id) {
        this.botaoAcao = "EDITAR";
        this.produtoApiService.buscarPorId(this.id).subscribe(
          (produto) => this.produto = produto
        );
      }
  }

  salvar() {
    if(this.id){
      this.produtoApiService.editar(this.id, this.produto).subscribe(
        (produto) => {
          alert(`Produto ${this.produto.nome} editado com sucesso!`);
          this.produto = produto;
        }
      )
    }
    else {
      this.produtoApiService.inserir(this.produto).subscribe(
        (produto) => {
          alert(`Produto ${produto.id} cadastrado com sucesso!`)
          this.produto = new Produto();    
        }
      );
    }
  }
  voltar() {
    this.router.navigate(['/listaProdutos']);
  }
}
