import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Carrito } from "./Carrito";
import { Producto } from "./Producto";

@Entity()
export class Item_carrito extends BaseEntity {
    @PrimaryGeneratedColumn()
    id_item_carrito:number;

    @ManyToOne( () => Carrito, carrito => carrito.items_carrito )
    carrito:Carrito;

    @ManyToOne( () => Producto, producto => producto.id_producto )
    producto:Producto;

    @Column()
    cantidad:number;

    @Column({type:"double", precision:12, scale:2 })
    subtotal:number;
}