import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Categoria extends BaseEntity {
    @PrimaryGeneratedColumn()
    id_categoria:number;

    @Index("idx_descripcion", {unique:true})
    @Column()
    descripcion:string;

    @CreateDateColumn()
    created_at:Date;
}