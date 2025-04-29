import { Request, Response } from "express";
import { Usuario } from "../models/Usuario";
import { Carrito } from "../models/Carrito";
import { Orden_compra } from "../models/Orden_compra";
import { Item_orden_compra } from "../models/Item_orden_compra";
import { Item_carrito } from "../models/Item_carrito";
import { validationResult } from "express-validator";

interface CompraCarritoInterface {
    id_usuario: number;
    metodo_de_pago: string;
    direccion_envio: string;
    canal: string;
}

export const comprarCarrito = async (request: Request, response: Response): Promise<any> => {
    const compraData: CompraCarritoInterface = request.body;

    // Valida campos de la compra
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(400).send({ mensaje: errors.array()[0].msg });

    // Busca el usuario en la base de datos
    let usuario: Usuario;
    try {
        usuario = await Usuario.findOneByOrFail({ id_usuario: compraData.id_usuario });
    } catch (error) {
        return response.status(400).send({ mensaje: "Usuario no encontrado" });
    }

    // Busca el carrito del usuario
    let carrito: Carrito;
    try {
        carrito = await Carrito.findOneOrFail({ where: { usuario: usuario }, relations: ["items_carrito", "items_carrito.producto"] });
    } catch (error) {
        return response.status(400).send({ mensaje: "Carrito no encontrado" });
    }

    // Verifica si el carrito tiene ítems
    if (carrito.items_carrito.length === 0) {
        return response.status(400).send({ mensaje: "El carrito está vacío" });
    }

    // Verifica la cantidad de los productos y actualiza las cantidades
    for (const item of carrito.items_carrito) {
        if (item.producto.cantidad < item.cantidad) {
            return response.status(400).send({ mensaje: `Cantidad insuficiente para el producto ${item.producto.nombre}` });
        }
        item.producto.cantidad -= item.cantidad;
        await item.producto.save();
    }

    // Crea la orden de compra
    const ordenCompra = new Orden_compra();
    ordenCompra.usuario = usuario;
    ordenCompra.total = carrito.items_carrito.reduce((sum, item) => sum + item.subtotal, 0);
    ordenCompra.metodo_de_pago = compraData.metodo_de_pago;
    ordenCompra.direccion_envio = compraData.direccion_envio;
    await ordenCompra.save();

    // Crea los ítems de la orden de compra
    for (const item of carrito.items_carrito) {
        const itemOrdenCompra = new Item_orden_compra();
        itemOrdenCompra.orden_compra = ordenCompra;
        itemOrdenCompra.producto = item.producto;
        itemOrdenCompra.cantidad = item.cantidad;
        itemOrdenCompra.subtotal = item.subtotal;
        await itemOrdenCompra.save();
    }

    // Limpia el carrito
    try {
        await Item_carrito.delete({ carrito: { id_carrito: carrito.id_carrito } });
    } catch (error) {
        return response.status(400).send({ mensaje: "Error al limpiar el carrito" });
    }

    return response.send({ mensaje: "Compra realizada con éxito", ordenCompra });
}

export const getAllOrdenesCompra = async (request: Request, response: Response): Promise<any> => {
    try {
        const ordenesCompra = await Orden_compra.find({ 
            relations: ["usuario", "items_orden_compra", "items_orden_compra.producto"] 
        });
        return response.send(ordenesCompra);
    } catch (error) {
        return response.status(500).send({ mensaje: "Error al obtener las órdenes de compra", error });
    }
}

export const getOrdenesCompraByUsuario = async (request: Request, response: Response): Promise<any> => {
    const { id_usuario } = request.params;

    // Valida el id_usuario
    if (!id_usuario || isNaN(Number(id_usuario))) {
        return response.status(400).send({ mensaje: "El id_usuario es obligatorio y debe ser un número" });
    }

    try {
        const ordenesCompra = await Orden_compra.find({ 
            where: { usuario: { id_usuario: Number(id_usuario) } },
            relations: ["usuario", "items_orden_compra", "items_orden_compra.producto"]
        });
        return response.send(ordenesCompra);
    } catch (error) {
        return response.status(500).send({ mensaje: "Error al obtener las órdenes de compra", error });
    }
}