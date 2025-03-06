"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdenesCompraByUsuario = exports.getAllOrdenesCompra = exports.comprarCarrito = void 0;
const Usuario_1 = require("../models/Usuario");
const Carrito_1 = require("../models/Carrito");
const Orden_compra_1 = require("../models/Orden_compra");
const Item_orden_compra_1 = require("../models/Item_orden_compra");
const Item_carrito_1 = require("../models/Item_carrito");
const comprarCarrito = async (request, response) => {
    const compraData = request.body;
    // Valida campos de la compra
    const validaError = validaCompraCarrito(compraData);
    if (validaError)
        return response.status(400).send({ mensaje: validaError });
    // Busca el usuario en la base de datos
    let usuario;
    try {
        usuario = await Usuario_1.Usuario.findOneByOrFail({ id_usuario: compraData.id_usuario });
    }
    catch (error) {
        return response.status(400).send({ mensaje: "Usuario no encontrado" });
    }
    // Busca el carrito del usuario
    let carrito;
    try {
        carrito = await Carrito_1.Carrito.findOneOrFail({ where: { usuario: usuario }, relations: ["items_carrito", "items_carrito.producto"] });
    }
    catch (error) {
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
    const ordenCompra = new Orden_compra_1.Orden_compra();
    ordenCompra.usuario = usuario;
    ordenCompra.total = carrito.items_carrito.reduce((sum, item) => sum + item.subtotal, 0);
    ordenCompra.metodo_de_pago = compraData.metodo_de_pago;
    ordenCompra.direccion_envio = compraData.direccion_envio;
    await ordenCompra.save();
    // Crea los ítems de la orden de compra
    for (const item of carrito.items_carrito) {
        const itemOrdenCompra = new Item_orden_compra_1.Item_orden_compra();
        itemOrdenCompra.orden_compra = ordenCompra;
        itemOrdenCompra.producto = item.producto;
        itemOrdenCompra.cantidad = item.cantidad;
        itemOrdenCompra.subtotal = item.subtotal;
        await itemOrdenCompra.save();
    }
    // Limpia el carrito
    try {
        await Item_carrito_1.Item_carrito.delete({ carrito: { id_carrito: carrito.id_carrito } });
    }
    catch (error) {
        return response.status(400).send({ mensaje: "Error al limpiar el carrito" });
    }
    return response.send({ mensaje: "Compra realizada con éxito", ordenCompra });
};
exports.comprarCarrito = comprarCarrito;
const validaCompraCarrito = (compra) => {
    const { id_usuario, metodo_de_pago, direccion_envio } = compra;
    if (id_usuario == undefined)
        return "Campo id_usuario es obligatorio";
    if (!(typeof id_usuario == "number"))
        return "Campo id_usuario debe ser un número";
    if (metodo_de_pago == undefined)
        return "Campo metodo_de_pago es obligatorio";
    if (!(typeof metodo_de_pago == "string"))
        return "Campo metodo_de_pago debe contener texto";
    if (metodo_de_pago.trim().length < 1)
        return "Campo metodo_de_pago es obligatorio";
    if (direccion_envio == undefined)
        return "Campo direccion_envio es obligatorio";
    if (!(typeof direccion_envio == "string"))
        return "Campo direccion_envio debe contener texto";
    if (direccion_envio.trim().length < 1)
        return "Campo direccion_envio es obligatorio";
};
const getAllOrdenesCompra = async (request, response) => {
    try {
        const ordenesCompra = await Orden_compra_1.Orden_compra.find({
            relations: ["usuario", "items_orden_compra", "items_orden_compra.producto"]
        });
        return response.send(ordenesCompra);
    }
    catch (error) {
        return response.status(500).send({ mensaje: "Error al obtener las órdenes de compra", error });
    }
};
exports.getAllOrdenesCompra = getAllOrdenesCompra;
const getOrdenesCompraByUsuario = async (request, response) => {
    const { id_usuario } = request.params;
    // Valida el id_usuario
    if (!id_usuario || isNaN(Number(id_usuario))) {
        return response.status(400).send({ mensaje: "El id_usuario es obligatorio y debe ser un número" });
    }
    try {
        const ordenesCompra = await Orden_compra_1.Orden_compra.find({
            where: { usuario: { id_usuario: Number(id_usuario) } },
            relations: ["usuario", "items_orden_compra", "items_orden_compra.producto"]
        });
        return response.send(ordenesCompra);
    }
    catch (error) {
        return response.status(500).send({ mensaje: "Error al obtener las órdenes de compra", error });
    }
};
exports.getOrdenesCompraByUsuario = getOrdenesCompraByUsuario;
