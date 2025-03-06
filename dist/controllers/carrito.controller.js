"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItemFromCarrito = exports.removeItemCantFromCarrito = exports.getAllCarritosDeUsuario = exports.getAllCarritos = exports.addItemToCarrito = void 0;
const Usuario_1 = require("../models/Usuario");
const Carrito_1 = require("../models/Carrito");
const Producto_1 = require("../models/Producto");
const Item_carrito_1 = require("../models/Item_carrito");
const addItemToCarrito = async (request, response) => {
    const itemData = request.body;
    // Valida campos del ítem del carrito
    const validaError = validaItemCarrito(itemData);
    if (validaError)
        return response.status(400).send({ mensaje: validaError });
    // Busca el usuario en la base de datos
    let usuario;
    try {
        usuario = await Usuario_1.Usuario.findOneByOrFail({ id_usuario: itemData.id_usuario });
    }
    catch (error) {
        return response.status(400).send({ mensaje: "Usuario no encontrado" });
    }
    // Busca o crea el carrito
    let carrito;
    try {
        carrito = await Carrito_1.Carrito.findOneOrFail({ where: { usuario: usuario } });
    }
    catch (error) {
        carrito = new Carrito_1.Carrito();
        carrito.usuario = usuario;
        await carrito.save();
    }
    // Busca el producto en la base de datos
    let producto;
    try {
        producto = await Producto_1.Producto.findOneByOrFail({ id_producto: itemData.id_producto });
    }
    catch (error) {
        return response.status(400).send({ mensaje: "Producto no encontrado", error });
    }
    // Busca el ítem del carrito existente
    let itemCarrito;
    try {
        itemCarrito = await Item_carrito_1.Item_carrito.findOneOrFail({
            where: {
                carrito: { id_carrito: carrito.id_carrito },
                producto: { id_producto: producto.id_producto }
            }
        });
        // Si el ítem ya existe, suma la cantidad
        itemCarrito.cantidad += itemData.cantidad;
        itemCarrito.subtotal = producto.precio * itemCarrito.cantidad;
    }
    catch (error) {
        // Si el ítem no existe, crea uno nuevo
        itemCarrito = new Item_carrito_1.Item_carrito();
        itemCarrito.carrito = carrito;
        itemCarrito.producto = producto;
        itemCarrito.cantidad = itemData.cantidad;
        itemCarrito.subtotal = producto.precio * itemData.cantidad; // Asumiendo que el producto tiene un campo precio
    }
    // Guarda el ítem del carrito
    try {
        await itemCarrito.save();
    }
    catch (error) {
        return response.status(500).send({ mensaje: "Error al guardar el ítem del carrito", error });
    }
    return response.send({ mensaje: "Ítem del carrito agregado con éxito" });
};
exports.addItemToCarrito = addItemToCarrito;
const validaItemCarrito = (item) => {
    const { id_usuario, id_producto, cantidad } = item;
    if (id_usuario == undefined)
        return "Campo id_usuario es obligatorio";
    if (!(typeof id_usuario == "number"))
        return "Campo id_usuario debe ser un número";
    if (id_producto == undefined)
        return "Campo id_producto es obligatorio";
    if (!(typeof id_producto == "number"))
        return "Campo id_producto debe ser un número";
    if (cantidad == undefined)
        return "Campo cantidad es obligatorio";
    if (!(typeof cantidad == "number"))
        return "Campo cantidad debe ser un número";
    if (cantidad < 1)
        return "Campo cantidad debe ser al menos 1";
};
const getAllCarritos = async (request, response) => {
    try {
        const carritos = await Carrito_1.Carrito.find({
            relations: ["usuario", "items_carrito", "items_carrito.producto"]
        });
        return response.send(carritos);
    }
    catch (error) {
        return response.status(500).send({ mensaje: "Error al obtener los carritos", error });
    }
};
exports.getAllCarritos = getAllCarritos;
const getAllCarritosDeUsuario = async (request, response) => {
    const { id } = request.params;
    try {
        const carritos = await Carrito_1.Carrito.findOne({
            where: { usuario: { id_usuario: id } },
            relations: ["usuario", "items_carrito", "items_carrito.producto"]
        });
        return response.send(carritos);
    }
    catch (error) {
        return response.status(500).send({ mensaje: "Error al obtener los carritos", error });
    }
};
exports.getAllCarritosDeUsuario = getAllCarritosDeUsuario;
const removeItemCantFromCarrito = async (request, response) => {
    const itemData = request.body;
    // Valida campos del ítem del carrito
    const validaError = validaUpdateItemCarrito(itemData);
    if (validaError)
        return response.status(400).send({ mensaje: validaError });
    // Busca el carrito del usuario
    let carrito;
    try {
        carrito = await Carrito_1.Carrito.findOneOrFail({ where: { usuario: { id_usuario: itemData.id_usuario } } });
    }
    catch (error) {
        return response.status(400).send({ mensaje: "Carrito no encontrado" });
    }
    // Busca el ítem del carrito
    let itemCarrito;
    try {
        itemCarrito = await Item_carrito_1.Item_carrito.findOneOrFail({
            where: {
                carrito: { id_carrito: carrito.id_carrito },
                producto: { id_producto: itemData.id_producto }
            },
            relations: {
                producto: true
            }
        });
    }
    catch (error) {
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
    }
    catch (error) {
        return response.status(500).send({ mensaje: "Error al actualizar el ítem del carrito", error });
    }
    return response.send({ mensaje: "Cantidad del ítem del carrito actualizada con éxito" });
};
exports.removeItemCantFromCarrito = removeItemCantFromCarrito;
const validaUpdateItemCarrito = (item) => {
    const { id_usuario, id_producto, cantidad } = item;
    if (id_usuario == undefined)
        return "Campo id_usuario es obligatorio";
    if (!(typeof id_usuario == "number"))
        return "Campo id_usuario debe ser un número";
    if (id_producto == undefined)
        return "Campo id_producto es obligatorio";
    if (!(typeof id_producto == "number"))
        return "Campo id_producto debe ser un número";
    if (cantidad == undefined)
        return "Campo cantidad es obligatorio";
    if (!(typeof cantidad == "number"))
        return "Campo cantidad debe ser un número";
    if (cantidad < 1)
        return "Campo cantidad debe ser al menos 1";
};
const removeItemFromCarrito = async (request, response) => {
    const itemData = request.body;
    // Valida campos del ítem del carrito
    const validaError = validaRemoveItemCarrito(itemData);
    if (validaError)
        return response.status(400).send({ mensaje: validaError });
    // Busca el carrito del usuario
    let carrito;
    try {
        carrito = await Carrito_1.Carrito.findOneOrFail({ where: { usuario: { id_usuario: itemData.id_usuario } } });
    }
    catch (error) {
        return response.status(400).send({ mensaje: "Carrito no encontrado" });
    }
    // Busca el ítem del carrito
    let itemCarrito;
    try {
        itemCarrito = await Item_carrito_1.Item_carrito.findOneOrFail({ where: {
                carrito: { id_carrito: carrito.id_carrito },
                producto: { id_producto: itemData.id_producto }
            } });
    }
    catch (error) {
        return response.status(400).send({ mensaje: "Producto no encontrado en el carrito" });
    }
    // Elimina el ítem del carrito
    try {
        await Item_carrito_1.Item_carrito.remove(itemCarrito);
    }
    catch (error) {
        return response.status(500).send({ mensaje: "Error al eliminar el ítem del carrito", error });
    }
    return response.send({ mensaje: "Ítem del carrito eliminado con éxito" });
};
exports.removeItemFromCarrito = removeItemFromCarrito;
const validaRemoveItemCarrito = (item) => {
    const { id_usuario, id_producto } = item;
    if (id_usuario == undefined)
        return "Campo id_usuario es obligatorio";
    if (!(typeof id_usuario == "number"))
        return "Campo id_usuario debe ser un número";
    if (id_producto == undefined)
        return "Campo id_producto es obligatorio";
    if (!(typeof id_producto == "number"))
        return "Campo id_producto debe ser un número";
};
