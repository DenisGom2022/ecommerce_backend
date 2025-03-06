import { BaseEntity, Column, CreateDateColumn, Entity, Index, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./Usuario";
import { Item_carrito } from "./Item_carrito";

@Entity()
export class Carrito extends BaseEntity {
    @PrimaryGeneratedColumn()
    id_carrito:number;

    @ManyToOne(() => Usuario, usuario => usuario.id_usuario)
    usuario:Usuario;

    @CreateDateColumn()
    created_at:Date;

    @OneToMany( () => Item_carrito, item_carrito => item_carrito.carrito)
    items_carrito:Item_carrito[];    
}