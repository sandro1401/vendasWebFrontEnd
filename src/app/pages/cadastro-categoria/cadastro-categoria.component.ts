import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from '../../models/categoria';
import { CategoriaService } from '../../service/categoria.service';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-cadastro-categoria',
  templateUrl: './cadastro-categoria.component.html',
  styleUrl: './cadastro-categoria.component.css'
})
export class CadastroCategoriaComponent {
  categoria = new Categoria();
  id?:number;
  botaoAcao = "CADASTRAR";
  form: FormGroup = new FormGroup({});

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaService,
  ){
    this.id = +this.route.snapshot.params['id'];
    if(this.id) {
      console.log(this.id)
      this.botaoAcao = "EDITAR";
      this.categoriaService.buscarPorId(this.id).subscribe(
        
        (categoria) => this.categoria = categoria
        
      );
  }
}

salvar(){
  if(this.id){
    console.log(this.id)
    this.categoriaService.editar(this.id, this.categoria).subscribe(
      (categoria) => {
        alert(`categoria ${this.categoria.nome} editado com sucesso!`);
        this.categoria = categoria;
      }
    )
  }
  else {
    this.categoriaService.inserir(this.categoria).subscribe(
      (categoria) => {
        alert(`categoria ${categoria.id} cadastrado com sucesso!`)
        this.categoria = new Categoria();    
      }
    );
  }
  
}

voltar() {
  this.router.navigate(['']);
}

}
