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
  produtos: Produto[] = [];
  users: Usuario[] = [];
  @Input() imagens_url: string = '';
  imagensTratadas: string[] = [];
  indiceImagAtual: number = 0;

  
  
  constructor(  private produtoService: ProdutoApiService,
    private pedidoService: PedidoService,private router: Router,
     private changeDetectorRef: ChangeDetectorRef){}
  
    ngOnInit(){
      //  this.carregarProdutos();

      if(this.imagens_url.indexOf('{')<0){
        this.imagensTratadas.push(this.imagens_url);
      }else{
        this.imagens_url = this.imagens_url.replace(/{|}|"/g, '');
        this.imagensTratadas = this.imagens_url.split(',');
      }
    }
    proximaImagem() {
      this.indiceImagAtual = (this.indiceImagAtual + 1) % this.imagensTratadas.length;
    }
    
    imagemAnterior() {
      this.indiceImagAtual = (this.indiceImagAtual - 1 + this.imagensTratadas.length) % this.imagensTratadas.length;
    }
    carregarProdutos() {
      this.produtoService.obterProdutos().subscribe((produtos) => {
        this.produto = produtos;
      
        if(this.produto.imagem_url.indexOf ('{') < 0){
          this.imagensTratadas.push(this.produto.imagem_url);
        }else{
          this.produto.imagem_url = this.produto.imagem_url.replace(/{|}|"/g, '');
          this.imagensTratadas = this.produto.imagem_url.split(',');
         
        }
        this.changeDetectorRef.detectChanges();
      });
    }
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
