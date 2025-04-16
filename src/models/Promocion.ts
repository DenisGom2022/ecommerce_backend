import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Promocion extends BaseEntity {
    @PrimaryGeneratedColumn()
    id_promocion:number;

    @Column()
    fecha_inicio:Date;

    @Column()
    fecha_fin:Date;

    @Column()
    descuento:number;
}