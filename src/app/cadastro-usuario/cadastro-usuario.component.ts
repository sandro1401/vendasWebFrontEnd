import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../usuario';
import { UsuarioApiService } from '../usuario-api.service';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.css'
})
export class CadastroUsuarioComponent {
  usuario = new Usuario();
  id?: number;
  botaoAcao = "CADASTRAR";

  constructor(
    private usuarioApiService: UsuarioApiService,
    private router: Router,
    private route : ActivatedRoute
  ){
    this.id = +this.route.snapshot.params["id"];
    if(this.id){
      this.botaoAcao = "EDITAR";
      this.usuarioApiService.buscarPorId(this.id).
      subscribe((usuario)=> this.usuario = usuario);
    }
  }
  salvar() {
    if(this.id){
      this.usuarioApiService.editar(this.id, this.usuario).subscribe(
        (usuario) => {
          alert(`usuario ${this.usuario.nome} editado com sucesso!`);
          this.usuario = usuario;
        }
      )
    }
    else {
      this.usuarioApiService.inserir(this.usuario).subscribe(
        (usuario) => {
          alert(`usuario ${usuario.id} cadastrado com sucesso!`)
          this.usuario = new Usuario();    
        }
      );
    }
  }
  voltar() {
    this.router.navigate(['']);
  }
  login(){
    this.router.navigate(['login'])
  }

}
