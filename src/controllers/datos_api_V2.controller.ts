import { Request, Response } from "express";
import { Producto } from "../models/Producto";
import { Categoria } from "../models/Categoria";
import { Carrito } from "../models/Carrito";
import { Item_carrito } from "../models/Item_carrito";
import { Orden_compra } from "../models/Orden_compra";
import { Item_orden_compra } from "../models/Item_orden_compra";
import { Usuario } from "../models/Usuario";

export const datosApi = async (request: Request, response: Response): Promise<any> => {
    let datos = {};
    try {
        const productos = await Producto.find({ relations: { categoria: true } });
        const categorias = await Categoria.find();
        const carritos = await Carrito.find({ relations: ["usuario", "items_carrito", "items_carrito.producto"] });
        const carritos2 = carritos.map(carrito => {
            const items_carrito = carrito.items_carrito.map(item => {
                const producto = item.producto.descripcion;;
                const id_producto = item.producto.id_producto;
                const precio_producto = item.producto.precio;
                return {
                    ...item,
                    producto,
                    id_producto,
                    precio_producto
                }
            })

            return {
                ...carrito,
                items_carrito
            }
        })

        const orden_compras2 = await Orden_compra.find({
            relations: ["usuario", "items_orden_compra", "items_orden_compra.producto"],
            select: {
                items_orden_compra: {
                    cantidad: true,
                    subtotal: true,
                    producto: {
                        id_producto: true,
                        nombre: true,
                        precio: true
                    }
                }
            }
        });

        const orden_compras = orden_compras2.map(orden => {
            const items_compra = orden.items_orden_compra.map(item => {
                const producto = item.producto.nombre;
                const id_producto = item.producto.id_producto;
                const precio_producto = item.producto.precio;
                return {
                    ...item,
                    producto,
                    id_producto,
                    precio_producto
                }
            })
            const dia_semana = new Date(orden.fecha_compra).toLocaleString('es-ES', { weekday: 'long' });
            return {
                ...orden,
                dia_semana,
                items_orden_compra: items_compra
            }
        })

        const usuarios = await Usuario.find();

        datos = {
            productos,
            categorias,
            carritos:carritos2,
            orden_compras,
            usuarios
        }
    } catch (error) {
        return response.status(500).send({ mensaje: "error en obtener datos" });
    }

    return response.send(datos);
}