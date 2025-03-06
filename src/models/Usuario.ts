import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Usuario extends BaseEntity {
    @PrimaryGeneratedColumn()
    id_usuario:number;

    @Index("idx_usuario", {unique:true})
    @Column()
    usuario:string;

    @Column()
    nombre:string;

    @Column()
    contrasena:string;
}