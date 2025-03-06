import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./Usuario";
import { Item_orden_compra } from "./Item_orden_compra";

@Entity()
export class Orden_compra extends BaseEntity {
    @PrimaryGeneratedColumn()
    id_orden_compra:number;

    @ManyToOne( () => Usuario, usuario => usuario.id_usuario )
    usuario:Usuario;

    @Column({type:"double", precision:12, scale:2 })
    total:number;

    @Column()
    metodo_de_pago:string;

    @Column()
    direccion_envio:string;

    @CreateDateColumn()
    fecha_compra:Date;

    @OneToMany( () => Item_orden_compra, item => item.orden_compra )
    items_orden_compra:Item_orden_compra[];
}