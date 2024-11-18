import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ItemPedido } from '../models/item-pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidoDataService {
  private itensSelecionadosSource = new BehaviorSubject<ItemPedido[]>([]);
  itensSelecionados$ = this.itensSelecionadosSource.asObservable();

  setItensSelecionados(itens: ItemPedido[]) {
    this.itensSelecionadosSource.next(itens);
  }

  getItensSelecionados(): ItemPedido[] {
    return this.itensSelecionadosSource.getValue();
  }

  clearItensSelecionados() {
    this.itensSelecionadosSource.next([]);
  }

  constructor() { }
}
