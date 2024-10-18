import { Pipe, PipeTransform } from '@angular/core';
import { Usuario } from './usuario';

@Pipe({
  name: 'filtroPesquisa'
})
export class FiltroPesquisaPipe implements PipeTransform {

  transform(listaUsuarios: Usuario[], nomePesquisado: string): Usuario[] {
    if(nomePesquisado.length <3){
      return listaUsuarios
    }
    return listaUsuarios.filter((usuario: Usuario)=>{
      return usuario.nome?.toLowerCase().includes(nomePesquisado.toLowerCase());
    });
  }

}
