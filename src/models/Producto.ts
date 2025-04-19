import { AfterLoad, BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Categoria } from "./Categoria";
import { Promocion } from "./Promocion";

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

    precio_real:number;

    @ManyToOne( ()=> Categoria, categoria => categoria.id_categoria )
    categoria:Categoria;

    @Column("text")
    descripcion:string;

    @Column()
    imagen:string;

    @OneToOne(() => Promocion, { nullable: true, eager: true })
    @JoinColumn()
    promocion:Promocion | null = null;

    @CreateDateColumn()
    created_at:Date;

    @UpdateDateColumn()
    updated_at:string;

    @AfterLoad()
    afterLoad() {
        const fechaHoy = new Date();
        this.precio_real = this.precio;
        if(this.promocion && (this.promocion.fecha_fin > fechaHoy && this.promocion.fecha_inicio < fechaHoy)) {
            this.precio = this.precio - (this.precio * (this.promocion.descuento / 100));
            this.precio = parseFloat(this.precio.toFixed(2));
        }else{
            this.promocion = null;
        }
    }

}