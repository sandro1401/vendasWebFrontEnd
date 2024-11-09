import {  ChangeDetectionStrategy, ChangeDetectorRef,Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProdutoApiService } from '../../service/produto-api.service';
import { PedidoService } from '../../service/pedido.service';
import { Produto } from '../../models/produto';
import { Usuario } from '../../models/usuario';
import { UsuarioApiService } from '../../service/usuario-api.service';
@Component({
  selector: 'app-card-produtos',
  templateUrl: './card-produtos.component.html',
  styleUrl: './card-produtos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardProdutosComponent implements OnInit {
  @Input() produto: any = '';
  // produto: any = '';
  produtos: Produto[] = [];
  users: Usuario[] = [];
  @Input() imagens_url: string = '';
  imagensTratadas: string[] = [];
  indiceImagAtual: number = 0;

  
  
  constructor(  private produtoService: ProdutoApiService,
    private pedidoService: PedidoService,private router: Router,
     private changeDetectorRef: ChangeDetectorRef){}
  
    ngOnInit(){
       this.carregarProdutos();

  
    }
    proximaImagem() {
      this.indiceImagAtual = (this.indiceImagAtual + 1) % this.imagensTratadas.length;
    }
    
    imagemAnterior() {
      this.indiceImagAtual = (this.indiceImagAtual - 1 + this.imagensTratadas.length) % this.imagensTratadas.length;
    }
//     carregarProdutos() {
//       this.produtoService.obterProdutos().subscribe((produtos) => {
//         this.produtos = produtos;
    
      
//           if(this.imagens_url.indexOf('{')<0){
//                 this.imagensTratadas.push(this.produto.imagem_url);
//               }else{
//                 this.produto.imagens_url = this.produto.imagens_url.replace(/{|}|"/g, '');
//                 this.imagensTratadas = this.produto.imagens_url.split(',');
              
//               }
//               this.changeDetectorRef.detectChanges();
// })};
    
// carregarProdutos() {
//   this.produtoService.obterProdutos().subscribe((produtos) => {
//     this.produtos = produtos.map((produto) => {
//       // Verifica e ajusta o caminho de uma imagem única
//       if (produto.imagem_url) {
//         produto.imagem_url = `${produto.imagem_url.replace(/\\/g,'/')}`;
//       }

//       // Verifica e ajusta o caminho de múltiplas imagens, se necessário
//       if (produto.imagem_url && produto.imagem_url.indexOf('{') < 0) {
//         // Adiciona a imagem única em imagensTratadas
//         this.imagensTratadas.push(produto.imagem_url);
//       } else if (produto.imagem_url) {
//         // Remove caracteres extras ({, }, ") e separa múltiplas URLs
//         produto.imagem_url = produto.imagem_url.replace(/{|}|"/g, '');
//         // Adiciona a URL base a cada imagem e corrige as barras
//         this.imagensTratadas = produto.imagem_url.split(',').map(
//           (imgPath) => `http://localhost:3000/${imgPath.trim().replace(/\\/g, '/')}`
//         );
//       }

//       return produto;
//     });

// carregarProdutos() {
//   this.produtoService.obterProdutos().subscribe((produtos) => {
//     this.produtos = produtos.map((produto) => {
//       // Verifica se imagem_url é uma string e converte em array, se necessário
//       if (typeof produto.imagem_url === 'string') {
//         produto.imagem_url = produto.imagem_url.replace(/{|}|"/g, '').split(',').map(
//           (imgPath: string) => `http://localhost:3000/${imgPath.trim().replace(/\\/g, '/')}`
//         );
//       }

//       return produto;
//     });

//     // Detecta mudanças para atualização do template
//     this.changeDetectorRef.detectChanges();
//   });
// }


carregarProdutos() {
  this.produtoService.obterProdutos().subscribe((produtos) => {
    this.produtos = produtos.map((produto) => {
      // Verifica e ajusta o caminho de uma imagem única
      if (produto.imagem_url) {
        produto.imagem_url = `${produto.imagem_url.replace(/\\/g,'/')}`;
      }

      // Verifica e ajusta o caminho de múltiplas imagens, se necessário
      if (produto.imagem_url && produto.imagem_url.indexOf('{') < 0) {
        // Adiciona a imagem única em imagensTratadas
        this.imagensTratadas.push(produto.imagem_url);
      } else if (produto.imagem_url) {
        // Remove caracteres extras ({, }, ") e separa múltiplas URLs
        produto.imagem_url = produto.imagem_url.replace(/{|}|"/g, '');
        // Adiciona a URL base a cada imagem e corrige as barras
        this.imagensTratadas = produto.imagem_url.split(',').map(
          (imgPath) => `http://localhost:3000/${imgPath.trim().replace(/\\/g, '/')}`
        );
      }

      return produto;
    });

    // Detecta mudanças para atualização do template
    this.changeDetectorRef.detectChanges();
  });
}
    
// carregarProdutos() {
//   this.produtoService.obterProdutos().subscribe((produtos) => {
//     this.produtos = produtos.map((produto) => {
//       // Verifica e ajusta o caminho de uma imagem única
//       if (produto.imagem_url) {
//         produto.imagem_url = `${produto.imagem_url.replace(/\\/g,'/')}`;
//       }

//       // Verifica e ajusta o caminho de múltiplas imagens, se necessário
//       if (produto.imagem_url && produto.imagem_url.indexOf('{') < 0) {
//         // Adiciona a imagem única em imagemTratadas
//         this.imagensTratadas.push(produto.imagem_url);
//       } else if (produto.imagem_url) {
//         // Remove caracteres extras ({, }, ") e separa múltiplas URLs
//         produto.imagem_url = produto.imagem_url.replace(/{|}|"/g, '');
//         // Adiciona a URL base a cada imagem e corrige as barras
//         this.imagensTratadas = produto.imagem_url.split(',').map(
//           (imgPath) => `http://localhost:3000/${imgPath.trim().replace(/\\/g, '/')}`
//         );
//       }

//       return produto;
//     });

//     // Detecta mudanças para atualização do template
//     this.changeDetectorRef.detectChanges();
//   });
// }
   
   
    adicionarProdutoAoPedido(produto: Produto)  {
      // this.pedidoService.adicionarProduto(produto);
      this.router.navigate(['/pedidos'],{
        queryParams:{
          produtoId: produto.id,
          usuarioId: this.obterUsuarioLogado() 
                }
      })};
    
      obterUsuarioLogado(){
        const userId = sessionStorage.getItem('usuario.id')
        
        return userId

      }

      finalizarPedido() {
      this.router.navigate(['/pedidos']);
    }
  //comprar() {
    //this.router.navigate(['/pedidos']);
  //}
}
