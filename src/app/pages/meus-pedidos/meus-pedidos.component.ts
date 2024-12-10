import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../service/pedido.service';
import { AuthService } from '../../service/auth/auth.service';
import { Pedido } from '../../models/pedido';
import { Usuario } from '../../models/usuario';
@Component({
  selector: 'app-meus-pedidos',
  templateUrl: './meus-pedidos.component.html',
  styleUrl: './meus-pedidos.component.css'
})
export class MeusPedidosComponent implements OnInit{
  pedidos: Pedido[] = [];
  usuarioLogado: Usuario | null = null;
  pedidoSelecionado: any = null;
  constructor(
    private pedidoService: PedidoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarUsuarioLogado();
  }

  carregarUsuarioLogado(): void {
    this.authService.obterUsuarioLogado().subscribe({
      next: (usuario) => {
        this.usuarioLogado = usuario;
        // console.log(this.usuarioLogado.id)
        this.carregarPedidos();
      },
      error: (error) => {
        console.error('Erro ao carregar usuário logado:', error);
      }
    });
  }

  carregarPedidos(): void {
    if (this.usuarioLogado) {
      this.pedidoService.listarPedido().subscribe({
        next: (pedidos) => {
          // console.log('Pedidos:', pedidos);
          // pedidos.forEach((pedido) => 
          //   console.log('Pedido ID:', pedido.id, 'UsuarioId:', pedido.usuarioId));
          // Filtra os pedidos do usuário logado
          this.pedidos = pedidos.filter(
            (pedido) => 
              // console.log(pedidos[0])
             pedido.usuarioId === this.usuarioLogado!.id
        
        );
          
        },
        error: (error) => {
          console.error('Erro ao carregar pedidos:', error);
        }
      });
    }
  }

  excluirPedido(id: number): void {
    this.pedidoService.deletar(id).subscribe({
      next: () => {
        this.pedidos = this.pedidos.filter((pedido) => pedido.id !== id);
        alert('Pedido excluído com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao excluir pedido:', error);
      }
    });
  }

  abrirModal(pedido: any): void {
    this.pedidoService.getPedidoById(pedido.id).subscribe({
      next: (pedidoCompleto) => {
        this.pedidoSelecionado = pedidoCompleto; 
      },
      error: (erro) => {
        console.error('Erro ao carregar itens do pedido:', erro);
      },
    });
  }
  
  
  
  fecharModal(): void {
    this.pedidoSelecionado = null;
  }
}
