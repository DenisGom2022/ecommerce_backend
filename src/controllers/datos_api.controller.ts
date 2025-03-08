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
        const productos = await Producto.find({relations:{categoria: true}});
        const categorias = await Categoria.find();
        const carritos = await Carrito.find({relations: ["usuario", "items_carrito", "items_carrito.producto"]});
        const orden_compras = await Orden_compra.find({ 
            relations: ["usuario", "items_orden_compra", "items_orden_compra.producto"] 
        });
        const usuarios = await Usuario.find();
    
        datos = {
            productos,
            categorias,
            carritos,
            orden_compras,
            usuarios
        }
    } catch (error) {
        return response.status(500).send({mensaje:"error en obtener datos"});
    }

    return response.send(datos);
}