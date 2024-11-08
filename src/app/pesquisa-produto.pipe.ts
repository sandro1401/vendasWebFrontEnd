import { Pipe, PipeTransform } from '@angular/core';
import { Produto } from './models/produto';

@Pipe({
  name: 'pesquisaProduto'
})
export class PesquisaProdutoPipe implements PipeTransform {

  transform(listaProdutos: Produto[], pesquisaProduto: string): Produto[] {
    if (pesquisaProduto.length <3){
      return listaProdutos
    }
    return listaProdutos.filter((produto:Produto)=>{
      return produto.nome?.toLowerCase().includes(pesquisaProduto.toLowerCase());
    });
  }

}
