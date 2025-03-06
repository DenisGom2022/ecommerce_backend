import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Orden_compra } from "./Orden_compra";
import { Producto } from "./Producto";

@Entity()
export class Item_orden_compra extends BaseEntity {
    @PrimaryGeneratedColumn()
    id_item_orden_compra:number;

    @ManyToOne( () => Orden_compra, orden_compra => orden_compra.items_orden_compra )
    orden_compra:Orden_compra;

    @ManyToOne( () => Producto, producto => producto.id_producto)
    producto:Producto;

    @Column()
    cantidad:number;

    @Column({ type: "double", precision:12, scale: 2 })
    subtotal:number;

}