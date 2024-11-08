import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-imagens-produtos',
  templateUrl: './imagens-produtos.component.html',
  styleUrl: './imagens-produtos.component.css'
})
export class ImagensProdutosComponent {
@Input() imagens_url: string = '';
imagensTratadas: string[] = [];
indiceImagAtual: number = 0;

ngOnInit(){
  if(this.imagens_url.indexOf('{')<0){
    this.imagensTratadas.push(this.imagens_url);
  }else{
    this.imagens_url = this.imagens_url.replace(/{|}|"/g, '');
    this.imagensTratadas = this.imagens_url.split( ',');
  }
}
proximaImagem() {
  this.indiceImagAtual = (this.indiceImagAtual + 1) % this.imagensTratadas.length;
}

imagemAnterior() {
  this.indiceImagAtual = (this.indiceImagAtual - 1 + this.imagensTratadas.length) % this.imagensTratadas.length;
}
}
