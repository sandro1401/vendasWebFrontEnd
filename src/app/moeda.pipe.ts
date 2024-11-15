import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moeda'
})
export class MoedaPipe implements PipeTransform {

  transform(valor: number | string | undefined): string {
    // Se o valor for undefined ou não é um número válido, retorna vazio
    if (valor == null || isNaN(Number(valor))) return "";

    // Converte o valor para número caso venha como string
    const valorNumerico = Number(valor);

    // Formata o valor com 2 casas decimais
    const valorDecimal = valorNumerico.toFixed(2);

    // Substitui o ponto por vírgula para o formato brasileiro
    const valorDecimalBr = valorDecimal.replace('.', ',');

    // Adiciona o símbolo de moeda
    return `R$ ${valorDecimalBr}`;
  }

}
