import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { UsuarioApiService } from '../../service/usuario-api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ViacepService } from '../../service/viacep.service';
import { cepValidator } from '../../cep-validator';

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
    nome: ['', [Validators.required]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    cep: ['', [Validators.required]],
      logradouro: [''],
      unidade: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],
      dt_nascimento: ['', [Validators.required]],
      telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      sexo: [''],
      tipo: ['']


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
        });
        ['logradouro', 'bairro', 'cidade', 'estado'].forEach(campo => {
          this.form.get(campo)?.markAsTouched();
        });

      }, error:() =>{
        console.log("Erro ao buscar o cep")

      }
    })
      
    }
  

  salvar() {
    if (this.form.invalid) {
      alert('Preencha todos os campos obrigatórios antes de salvar.');
      return;
    }
    const usuarioAtual = { ...this.usuario };
      if(this.usuario.dt_nascimento instanceof Date){
        usuarioAtual.dt_nascimento = this.formatarData(this.usuario.dt_nascimento)
      
      }
    if(this.id){
      console.log(usuarioAtual.dt_nascimento)
      this.usuarioApiService.editar(this.id, usuarioAtual).subscribe(
        (usuario) => {
          alert(`usuario ${this.usuario.nome} editado com sucesso!`);
          this.usuario = usuario;
        },
        (error) => {
          alert('Erro ao editar o usuário. Tente novamente.');
        }
      )
    }
    else {
      console.log(usuarioAtual.dt_nascimento)
      this.usuarioApiService.inserir(usuarioAtual).subscribe(
        (usuario) => {
          alert(`usuario ${usuario.id} cadastrado com sucesso!`)
          this.usuario = new Usuario();  
          this.router.navigate([''])  
        }
      );
    }
  }

  temErro(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control && control.invalid && control.touched);
  }
  
  
  voltar() {
    this.router.navigate(['']);
  }
  login(){
    this.router.navigate(['login'])
  }

  formatarData(data: Date): string {
    const ano = data.getFullYear();
    const mes = (data.getMonth() + 1).toString().padStart(2, '0'); 
    const dia = data.getDate().toString().padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
  

}
