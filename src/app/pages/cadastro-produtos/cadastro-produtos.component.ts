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

    // Adiciona os campos de produto ao FormData
    if (this.produto.nome) formData.append('nome', this.produto.nome);
    if (this.produto.descricao) formData.append('descricao', this.produto.descricao);
    if (this.produto.preco) formData.append('preco', String(this.produto.preco));
    if (this.produto.categoriaId !== undefined) formData.append('categoriaId', String(this.produto.categoriaId));
    if (this.produto.usuarioId !== undefined) formData.append('usuarioId', String(this.produto.usuarioId));
    
    // Adiciona a imagem ao FormData
    formData.append('imagem_url', this.imagemSelecionada);

     // Inserção ou edição com imagem
    if (this.id) {
      this.produtoApiService.editarComImagem(this.id, formData).subscribe(
        (produto) => {
          alert(`Produto ${this.produto.nome} editado com sucesso!`);
          this.produto = produto;
        }
      );
    } else {
      formData.forEach((value, key) => console.log(key, value)); // log para depuração
      this.produtoApiService.inserirComImagem(formData).subscribe(
        
        (produto) => {
          alert(`Produto cadastrado com sucesso ID: ${produto.id}!`);
          this.produto = new Produto();
        },
        (error) => {
          console.error("Erro ao cadastrar produto:", error); // Log de erro
        }
      );
    }
  } else {
    console.error("Imagem não selecionada ou `imagemSelecionada` é nula.");
  }
}

// selecionarArquivos(event: any) {
//   const arquivos = event.target.files;
//   for(let arquivo of arquivos) {
//     let reader = new FileReader();
//     reader.onload = (e:any) => {
//       this.imagem_url.push(this.createItem({
//         file: arquivo,
//          url: e.target.result
//       }))
//     }
//     reader.readAsDataURL(arquivo);
//   } 
//   }
// selecionarArquivos(event: any) {
//   this.arquivoSelecionado = event.target.files;
// }
// uploadArquivo(arquivo: File): any{
//   const formData = new FormData();
//   formData.append('imagem_url', arquivo)
//   return
// }
// salvar() {
//   if (this.imagemSelecionada) {
//     const formData = new FormData();

//     // Adiciona os campos ao FormData apenas se tiverem valor definido
//     if (this.produto.nome) formData.append('nome', String(this.produto.nome));
//     if (this.produto.descricao) formData.append('descricao', String(this.produto.descricao));
//     if (this.produto.preco) formData.append('preco', String(this.produto.preco));
//     if (this.produto.categoriaId !== undefined) formData.append('categoriaId', String(this.produto.categoriaId));
//     if (this.produto.usuarioId !== undefined) formData.append('usuarioId', String(this.produto.usuarioId));
//     formData.append('imagem_url', this.imagemSelecionada);

//     if (this.id) {
//       this.produtoApiService.editarComImagem(this.id, formData).subscribe(
//         (produto) => {
//           alert(`Produto ${this.produto.nome} editado com sucesso!`);
//           this.produto = produto;
//         }
//       );
//     } else {
//       console.log(formData)
//       this.produtoApiService.inserirComImagem(formData).subscribe(
//         (produto) => {
//           console.log(formData)
//           alert(`Produto ${this.produto.id} cadastrado com sucesso!`);
//           produto = new Produto();
//         }
//       );
//     }
//   } else {
//     // Caso não tenha imagem, mantém o método original
//     if (this.id) {
//       this.produtoApiService.editar(this.id, this.produto).subscribe(
//         (produto) => {
//           alert(`Produto ${this.produto.nome} editado com sucesso!`);
//           this.produto = produto;
//         }
//       );
//     } else {
//       this.produtoApiService.inserir(this.produto).subscribe(
//         (produto) => {
//           console.log(produto)
//           alert(`Produto ${produto.id} cadastrado com sucesso!`);
//           this.produto = new Produto();
//         }
//       );
//     }
//   }
// }

  // salvar() {
  //   if(this.id){
  //     this.produtoApiService.editar(this.id, this.produto).subscribe(
  //       (produto) => {
  //         alert(`Produto ${this.produto.nome} editado com sucesso!`);
  //         this.produto = produto;
  //       }
  //     )
  //   }
  //   else {
  //     console.log(this.produto)
  //       this.produtoApiService.inserir(this.produto).subscribe(
  //       (produto) => {
  //         alert(`Produto ${produto.id} cadastrado com sucesso!`)
  //         this.produto = new Produto();    
  //       }
  //     );
  //   }
  // }

  voltar() {
    this.router.navigate(['/produtos']);
  }
  
}