import { Produto } from "./produto";

export class ItemPedido {
    id?: number ;
    quantidade?: number;  
    preco_unitario?: number;  
    pedidoId?: number;
    produtoId?: number;
    concluido?: boolean;
    produto?: Produto

}
