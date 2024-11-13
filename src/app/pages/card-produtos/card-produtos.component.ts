import {  ChangeDetectionStrategy, ChangeDetectorRef,Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProdutoApiService } from '../../service/produto-api.service';
import { PedidoService } from '../../service/pedido.service';
import { Produto } from '../../models/produto';
import { Usuario } from '../../models/usuario';
import { UsuarioApiService } from '../../service/usuario-api.service';
import { ItemPedido } from '../../models/item-pedido';
import { Pedido } from '../../models/pedido';
@Component({
  selector: 'app-card-produtos',
  templateUrl: './card-produtos.component.html',
  styleUrl: './card-produtos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardProdutosComponent implements OnInit {
  @Input() produto: any = '';
  pedidoAtual!: Pedido;
  produtos: Produto[] = [];
  users: Usuario[] = [];
  @Input() imagens_url: string = '';
  imagensTratadas: { [key: number]: string[] } = {};
 
  indiceImagAtual: number = 0;
  idUsuario = ';'
  
  
  constructor(  private produtoService: ProdutoApiService,
    private pedidoService: PedidoService,private router: Router,
     private changeDetectorRef: ChangeDetectorRef, private usuarioApiService: UsuarioApiService){
      this.idUsuario = this.usuarioApiService.getUsuarioId();
     }
  
    ngOnInit(){
      this.idUsuario
       this.carregarProdutos();

  
    }

    carregarProdutos() {
      this.produtoService.obterProdutos().subscribe((produtos) => {
        this.produtos = produtos.map((produto) => {
          if (produto.imagem_url) {
            if (Array.isArray(produto.imagem_url)) {
              // Caso seja um array de imagens
              const imagensCorrigidas = produto.imagem_url.map((imgPath) => {
                // Remove caracteres extras e corrige o caminho
                return `http://localhost:3000/${imgPath.replace(/[{}"]/g, '').replace(/\\/g, '/').replace('uploads/', 'uploads/')}`;
              });
              if (produto.id) {
                this.imagensTratadas[produto.id] = imagensCorrigidas;
              }
            } else if (typeof produto.imagem_url === 'string') {
              // Caso seja uma string (uma única imagem)
              const imagemCorrigida = `http://localhost:3000/${produto.imagem_url.replace(/[{}"]/g, '').replace(/\\/g, '/').replace('uploads/', 'uploads/')}`;
              if (produto.id) {
                this.imagensTratadas[produto.id] = [imagemCorrigida];
              }
            }
          }
    
          return produto;
        });
    
        this.changeDetectorRef.detectChanges();
      });
    }
  
    adicionarProdutoAoPedido(produto: Produto) {
      const quantidade = 1; // Defina uma quantidade padrão ou permita o usuário especificar
  
      if (!this.pedidoAtual) {
          // Se não houver um pedido atual, cria um novo pedido
          this.pedidoAtual = new Pedido();
          this.pedidoAtual.quantidade = quantidade;
          this.pedidoAtual.usuarioId = this.obterUsuarioLogado(); // Defina o usuário atual, se necessário
          this.pedidoAtual.data_Pedido = new Date();
          this.pedidoAtual.produtoId = produto.id;
          this.pedidoAtual.valorTotal = produto.preco! * quantidade; // Inicialize o valor total em 0
          
          if (!this.pedidoAtual.usuarioId || !this.pedidoAtual.produtoId || !this.pedidoAtual.quantidade || !this.pedidoAtual.valorTotal) {
            console.error('Erro: Informações incompletas para criar o pedido');
            return;
        }
          // Crie o novo pedido e, ao concluir, adicione o produto como item
          this.pedidoService.criarPedido(this.pedidoAtual).subscribe(
             (pedido) => {
                  this.pedidoAtual = pedido;
                 
                  //  pedido recém-criado
                  this.router.navigate(['/pedidos', this.pedidoAtual.id]);
                  // this.adicionarItemAoPedido(produto, quantidade);
              }
             
          );
      } else {
          // Se já houver um pedido em andamento, 
          this.router.navigate(['/pedidos', this.pedidoAtual.id]);
      }
  }
  
  private adicionarItemAoPedido(produto: Produto, quantidade: number) {
      if (this.pedidoAtual?.id) {
          this.pedidoService
              .adicionarProdutoPedido(produto, quantidade, this.pedidoAtual.id)
              .subscribe({
                  next: (itemPedido) => {
                      console.log('Item adicionado ao pedido:', itemPedido);
                      // Aqui você pode atualizar a interface para mostrar o item adicionado
                  },
                  error: (err) => {
                      console.error('Erro ao adicionar o item ao pedido:', err);
                  }
              });
      }
  }
  

    // adicionarProdutoAoPedido(produto: Produto) {
    //   const quantidade = 1; // Ou defina uma quantidade padrão ou permitida pelo usuário
  
    //   // Se não houver um pedido atual, crie um novo pedido
    //   if (!this.pedidoAtual) {
    //     this.pedidoAtual = new Pedido();
    //     this.pedidoAtual.quantidade = quantidade;
    //     this.pedidoAtual.usuarioId = this.obterUsuarioLogado(); // Defina o usuário atual, se necessário
    //     this.pedidoAtual.data_Pedido = new Date();
    //     this.pedidoAtual.valorTotal = 0; // Inicialize com 0
  
    //     // Salve o novo pedido e, ao concluir, adicione o item
    //     this.pedidoService.criarPedido(this.pedidoAtual).subscribe((pedido) => {
    //       this.pedidoAtual = pedido;
  
    //       // Agora, adicione o item ao pedido criado
    //       this.adicionarItemAoPedido(produto, quantidade);
    //     });
    //   } else {
    //     // Se já houver um pedido em andamento, adicione o item diretamente
    //     this.adicionarItemAoPedido(produto, quantidade);
    //   }
    // }
    // private adicionarItemAoPedido(produto: Produto, quantidade: number) {
    //   if (this.pedidoAtual?.id) {
    //     this.pedidoService
    //       .adicionarProdutoPedido(produto, quantidade, this.pedidoAtual.id)
    //       .subscribe((itemPedido) => {
    //         console.log('Item adicionado ao pedido:', itemPedido);
    //         // Aqui você pode atualizar a interface, mostrar um feedback ao usuário, etc.
    //       });
    //   }
    // }
  
    criarNovoPedido(): number {
      // Função para criar um novo pedido e retornar seu ID
      // Você precisará implementar a criação do pedido (pode estar no PedidoService também)
      return 1; // Exemplo: substitua pelo ID do novo pedido criado
    }
  
    obterUsuarioLogado() {
      const usuarioId = sessionStorage.getItem('usuario.id');
    return  Number(usuarioId);
    }

      finalizarPedido() {
      this.router.navigate(['/pedidos']);
    }
  //comprar() {
    //this.router.navigate(['/pedidos']);
  //}
}
