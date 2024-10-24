import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { UsuarioApiService } from '../../service/usuario-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViacepService } from '../../service/viacep.service';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.css'
})
export class CadastroUsuarioComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  usuario = new Usuario();
  id?: number;
  botaoAcao = "CADASTRAR";

  constructor(
    private usuarioApiService: UsuarioApiService,
    private router: Router,
    private route : ActivatedRoute,
    private fb: FormBuilder,
    private viacepService: ViacepService,
  ){
    this.id = +this.route.snapshot.params["id"];
    if(this.id){
      this.botaoAcao = "EDITAR";
      this.usuarioApiService.buscarPorId(this.id).
      subscribe((usuario)=> this.usuario = usuario);
    }
  }
  ngOnInit(): void {
    this.initializeForm();
    this.observePreenchimentoCep();
  }
  
  initializeForm(){
    this.form = this.fb.group({
      cep: ['', [Validators.required]],
      logradouro: [''],
      unidade: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],
    })
  }

  observePreenchimentoCep(){
    this.form.get('cep')?.valueChanges.subscribe(value => {
      if(value?.length == 8){
      this.buscarCep();
      }
    })
  }

  buscarCep(){
    var cep = this.form.get('cep')?.value;
    this.viacepService.getEnderecoByCep(cep).subscribe({
      next: (response) => {
        this.form.patchValue({
          logradouro: response.logradouro,
          bairro: response.bairro,
          cidade: response.localidade,
          estado: response.uf,
        })

      }, error:() =>{
        console.log("Erro ao buscar o cep")

      }
    })
      
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
