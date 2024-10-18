import { Component } from '@angular/core';
import { Usuario } from '../usuario';
import { UsuarioApiService } from '../usuario-api.service';

@Component({
  selector: 'app-list-usuarios',
  templateUrl: './list-usuarios.component.html',
  styleUrl: './list-usuarios.component.css'
})
export class ListUsuariosComponent {
listaUsuarios: Usuario[] = [];
nomePesquisado = '';

constructor(private usuarioApiService: UsuarioApiService){
  this.listar();
}
listar(){
  this.usuarioApiService.listar().subscribe( 
    (usuarios) =>{this.listaUsuarios = usuarios;});
}
deletar(id?: number){
  this.usuarioApiService.deletar(id!).subscribe(
    (usuario) =>{
      alert("Usuario deletado com sucesso!");
      this.listar();
    }
  )
}
}
