import { Pipe, PipeTransform } from '@angular/core';
import { Categoria } from './models/categoria';

@Pipe({
  name: 'pesquisaCategoria'
})
export class PesquisaCategoriaPipe implements PipeTransform {

  transform(listaCategoria: Categoria[], categoriaPesquisada: string): Categoria[] {
    if(categoriaPesquisada.length <3){
      return listaCategoria;
    }
   return listaCategoria.filter((categoria: Categoria)=> {
    return categoria.nome?.toLowerCase().includes(categoriaPesquisada.toLowerCase());
   })
  }

}
