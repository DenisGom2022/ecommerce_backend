import { Request, Response } from "express";
import { Usuario } from "../models/Usuario";
import { Carrito } from "../models/Carrito";
import { Producto } from "../models/Producto";
import { Item_carrito } from "../models/Item_carrito";

interface ItemCarritoInterface {
    id_usuario: number;
    id_producto: number;
    cantidad: number;
}

export const addItemToCarrito = async (request: Request, response: Response): Promise<any> => {
    const itemData: ItemCarritoInterface = request.body;

    // Valida campos del ítem del carrito
    const validaError = validaItemCarrito(itemData);
    if (validaError) return response.status(400).send({ mensaje: validaError });

    // Busca el usuario en la base de datos
    let usuario: Usuario;
    try {
        usuario = await Usuario.findOneByOrFail({ id_usuario: itemData.id_usuario });
    } catch (error) {
        return response.status(400).send({ mensaje: "Usuario no encontrado" });
    }

    // Busca o crea el carrito
    let carrito: Carrito;
    try {
        carrito = await Carrito.findOneOrFail({ where: { usuario: usuario } });
    } catch (error) {
        carrito = new Carrito();
        carrito.usuario = usuario;
        await carrito.save();
    }

    // Busca el producto en la base de datos
    let producto: Producto;
    try {
        producto = await Producto.findOneByOrFail({ id_producto: itemData.id_producto });
    } catch (error) {
        return response.status(400).send({ mensaje: "Producto no encontrado", error });
    }

    // Busca el ítem del carrito existente
    let itemCarrito: Item_carrito;
    try {
        itemCarrito = await Item_carrito.findOneOrFail({
            where: {
                carrito: { id_carrito: carrito.id_carrito },
                producto: { id_producto: producto.id_producto }
            }
        });
        // Si el ítem ya existe, suma la cantidad
        itemCarrito.cantidad += itemData.cantidad;
        itemCarrito.subtotal = producto.precio * itemCarrito.cantidad;
    } catch (error) {
        // Si el ítem no existe, crea uno nuevo
        itemCarrito = new Item_carrito();
        itemCarrito.carrito = carrito;
        itemCarrito.producto = producto;
        itemCarrito.cantidad = itemData.cantidad;
        itemCarrito.subtotal = producto.precio * itemData.cantidad; // Asumiendo que el producto tiene un campo precio
    }

    // Guarda el ítem del carrito
    try {
        await itemCarrito.save();
    } catch (error: any) {
        return response.status(500).send({ mensaje: "Error al guardar el ítem del carrito", error });
    }

    return response.send({ mensaje: "Ítem del carrito agregado con éxito" });
}

const validaItemCarrito = (item: ItemCarritoInterface) => {
    const { id_usuario, id_producto, cantidad } = item;
    if (id_usuario == undefined) return "Campo id_usuario es obligatorio";
    if (!(typeof id_usuario == "number")) return "Campo id_usuario debe ser un número";

    if (id_producto == undefined) return "Campo id_producto es obligatorio";
    if (!(typeof id_producto == "number")) return "Campo id_producto debe ser un número";

    if (cantidad == undefined) return "Campo cantidad es obligatorio";
    if (!(typeof cantidad == "number")) return "Campo cantidad debe ser un número";
    if (cantidad < 1) return "Campo cantidad debe ser al menos 1";
}

export const getAllCarritos = async (request: Request, response: Response): Promise<any> => {
    try {
        const carritos = await Carrito.find({
            relations: ["usuario", "items_carrito", "items_carrito.producto"]
        });
        return response.send(carritos);
    } catch (error) {
        return response.status(500).send({ mensaje: "Error al obtener los carritos", error });
    }
}

export const getAllCarritosDeUsuario = async (request: Request, response: Response): Promise<any> => {
    const { id }: any = request.params;
    try {
        const carritos = await Carrito.findOne({
            where: { usuario: { id_usuario: id } },
            relations: ["usuario", "items_carrito", "items_carrito.producto"]
        });
        return response.send(carritos);
    } catch (error) {
        return response.status(500).send({ mensaje: "Error al obtener los carritos", error });
    }
}

interface UpdateItemCarritoInterface {
    id_usuario: number;
    id_producto: number;
    cantidad: number;
}

export const removeItemCantFromCarrito = async (request: Request, response: Response): Promise<any> => {
    const itemData: UpdateItemCarritoInterface = request.body;

    // Valida campos del ítem del carrito
    const validaError = validaUpdateItemCarrito(itemData);
    if (validaError) return response.status(400).send({ mensaje: validaError });

    // Busca el carrito del usuario
    let carrito: Carrito;
    try {
        carrito = await Carrito.findOneOrFail({ where: { usuario: { id_usuario: itemData.id_usuario } } });
    } catch (error) {
        return response.status(400).send({ mensaje: "Carrito no encontrado" });
    }

    // Busca el ítem del carrito
    let itemCarrito: Item_carrito;
    try {
        itemCarrito = await Item_carrito.findOneOrFail({
            where: {
                carrito: { id_carrito: carrito.id_carrito },
                producto: { id_producto: itemData.id_producto }
            },
            relations: {
                producto:true
            }
        });
    } catch (error) {
        return response.status(400).send({ mensaje: "Producto no encontrado en el carrito" });
    }

    // Verifica si se puede quitar la cantidad
    if (itemCarrito.cantidad - itemData.cantidad < 1) {
        return response.status(400).send({ mensaje: "No se puede quitar la cantidad, el producto debe tener al menos 1 unidad en el carrito" });
    }

    // Resta la cantidad del ítem del carrito
    itemCarrito.cantidad -= itemData.cantidad;
    itemCarrito.subtotal = itemCarrito.producto.precio * itemCarrito.cantidad;

    // Guarda el ítem del carrito actualizado
    try {
        await itemCarrito.save();
    } catch (error: any) {
        return response.status(500).send({ mensaje: "Error al actualizar el ítem del carrito", error });
    }

    return response.send({ mensaje: "Cantidad del ítem del carrito actualizada con éxito" });
}

const validaUpdateItemCarrito = (item: UpdateItemCarritoInterface) => {
    const { id_usuario, id_producto, cantidad } = item;
    if (id_usuario == undefined) return "Campo id_usuario es obligatorio";
    if (!(typeof id_usuario == "number")) return "Campo id_usuario debe ser un número";

    if (id_producto == undefined) return "Campo id_producto es obligatorio";
    if (!(typeof id_producto == "number")) return "Campo id_producto debe ser un número";

    if (cantidad == undefined) return "Campo cantidad es obligatorio";
    if (!(typeof cantidad == "number")) return "Campo cantidad debe ser un número";
    if (cantidad < 1) return "Campo cantidad debe ser al menos 1";
}

interface RemoveItemCarritoInterface {
    id_usuario: number;
    id_producto: number;
}

export const removeItemFromCarrito = async (request: Request, response: Response): Promise<any> => {
    const itemData: RemoveItemCarritoInterface = request.body;

    // Valida campos del ítem del carrito
    const validaError = validaRemoveItemCarrito(itemData);
    if (validaError) return response.status(400).send({ mensaje: validaError });

    // Busca el carrito del usuario
    let carrito: Carrito;
    try {
        carrito = await Carrito.findOneOrFail({ where: { usuario: { id_usuario: itemData.id_usuario } } });
    } catch (error) {
        return response.status(400).send({ mensaje: "Carrito no encontrado" });
    }

    // Busca el ítem del carrito
    let itemCarrito: Item_carrito;
    try {
        itemCarrito = await Item_carrito.findOneOrFail({ where: { 
            carrito: { id_carrito: carrito.id_carrito }, 
            producto: { id_producto: itemData.id_producto } 
        } });
    } catch (error) {
        return response.status(400).send({ mensaje: "Producto no encontrado en el carrito" });
    }

    // Elimina el ítem del carrito
    try {
        await Item_carrito.remove(itemCarrito);
    } catch (error: any) {
        return response.status(500).send({ mensaje: "Error al eliminar el ítem del carrito", error });
    }

    return response.send({ mensaje: "Ítem del carrito eliminado con éxito" });
}

const validaRemoveItemCarrito = (item: RemoveItemCarritoInterface) => {
    const { id_usuario, id_producto } = item;
    if (id_usuario == undefined) return "Campo id_usuario es obligatorio";
    if (!(typeof id_usuario == "number")) return "Campo id_usuario debe ser un número";

    if (id_producto == undefined) return "Campo id_producto es obligatorio";
    if (!(typeof id_producto == "number")) return "Campo id_producto debe ser un número";
}