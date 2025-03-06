import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Categoria } from "./Categoria";

@Entity()
export class Producto extends BaseEntity {
    @PrimaryGeneratedColumn()
    id_producto:number;

    @Column()
    nombre:string;

    @Column({type:"int"})
    cantidad:number;

    @Column({type:"double", precision:12, scale:2 })
    precio:number;

    @ManyToOne( ()=> Categoria, categoria => categoria.id_categoria )
    categoria:Categoria;

    @Column("text")
    descripcion:string;

    @Column()
    imagen:string;

    @CreateDateColumn()
    created_at:Date;

    @UpdateDateColumn()
    updated_at:string;

}