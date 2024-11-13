import { ItemPedido } from "./item-pedido";
export class Pedido {
    id?: number;
    quantidade?: number;  
    valorTotal?: number;
    data_Pedido?: Date;  
    produtoId?: number;
    usuarioId?: number;
    itens?: ItemPedido[];
}

