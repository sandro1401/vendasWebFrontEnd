import { Component } from '@angular/core';
import { Categoria } from '../../models/categoria';
import { CategoriaService } from '../../service/categoria.service';

@Component({
  selector: 'app-list-categoria',
  templateUrl: './list-categoria.component.html',
  styleUrl: './list-categoria.component.css'
})
export class ListCategoriaComponent {
  listaCategoria: Categoria[] = []
  categoriaPesquisada = '';

  constructor(private categoriaService: CategoriaService){
    this.listar();
  }
  listar(){
    this.categoriaService.listar().subscribe( 
      (categoria=>{this.listaCategoria = categoria}));
  }
  deletar(id?: number){
    this.categoriaService.deletar(id!).subscribe(
      (categoria) =>{
        alert("Categoria deletado com sucesso!");
        this.listar();
      }
    )
  }
      

  }


