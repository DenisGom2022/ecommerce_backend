import { Request, Response } from "express";
import { getAllProducto } from "./producto.controller"
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
        const productos = await Producto.find();
        const categorias = await Categoria.find();
        const carritos = await Carrito.find();
        const item_carritos = await Item_carrito.find();
        const orden_compras = await Orden_compra.find();
        const item_orden_compras = await Item_orden_compra.find();
        const usuarios = await Usuario.find();
    
        datos = {
            productos,
            categorias,
            carritos,
            item_carritos,
            orden_compras,
            item_orden_compras,
            usuarios
        }
    } catch (error) {
        return response.status(500).send({mensaje:"error en obtener datos"});
    }

    return response.send(datos);
}