import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Produto } from '../../models/produto';
import { ProdutoApiService } from '../../service/produto-api.service';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-cadastro-produtos',
  templateUrl: './cadastro-produtos.component.html',
  styleUrl: './cadastro-produtos.component.css'
})
export class CadastroProdutosComponent implements OnInit{
  produto = new Produto();
  id?:number;
  botaoAcao = "CADASTRAR";
  form: FormGroup = new FormGroup({});
  arquivoSelecionado: File | null = null;
  imagemSelecionada?: File;
  constructor(
    private produtoApiService: ProdutoApiService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    ) {
      this.id = +this.route.snapshot.params['id'];
      if(this.id) {
        this.botaoAcao = "EDITAR";
        this.produtoApiService.buscarPorId(this.id).subscribe(
          (produto) => this.produto = produto
        );
      }
      
  }

ngOnInit(): void {}
selecionarArquivo(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    this.imagemSelecionada = input.files[0];
  }
}

salvar() {
  if (this.imagemSelecionada) {
    const formData = new FormData();

    if (this.produto.nome) formData.append('nome', this.produto.nome);
    if (this.produto.descricao) formData.append('descricao', this.produto.descricao);
    if (this.produto.preco) formData.append('preco', String(this.produto.preco));
    if (this.produto.categoriaId !== undefined) formData.append('categoriaId', String(this.produto.categoriaId));
    if (this.produto.usuarioId !== undefined) formData.append('usuarioId', String(this.produto.usuarioId));
    
    // Adiciona a imagem ao FormData
    formData.append('imagem_url', this.imagemSelecionada);

     // Inserção ou edição com imagem
    if (this.id) {
      formData.forEach((value, key) => console.log(key, value));
      this.produtoApiService.editarComImagem(this.id, formData).subscribe(
        (produto) => {
          alert(`Produto ${this.produto.nome} editado com sucesso!`);
          this.produto = produto;
        }
      );
    } else {
      formData.forEach((value, key) => console.log(key, value)); 
      this.produtoApiService.inserirComImagem(formData).subscribe(
        (produto) => {
          alert(`Produto cadastrado com sucesso ID: ${produto.id}!`);
          this.produto = new Produto();
        },
        (error) => {
          console.error("Erro ao cadastrar produto:", error); 
        }
      );
    }
  } else {
    console.error("Imagem não selecionada ou `imagemSelecionada` é nula.");
  }
}

  voltar() {
    this.router.navigate(['/produtos']);
  }
  
}