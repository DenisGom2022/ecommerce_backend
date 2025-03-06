"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProducto = exports.deleteProducto = exports.getProducto = exports.getAllProducto = exports.saveProducto = void 0;
const Producto_1 = require("../models/Producto");
const Categoria_1 = require("../models/Categoria");
const typeorm_1 = require("typeorm");
const saveProducto = async (request, response) => {
    const producto = request.body;
    const errorValidacion = validaProducto(producto);
    if (errorValidacion)
        return response.status(400).send({ mensaje: errorValidacion });
    //busca categoria
    let categoria;
    try {
        categoria = await Categoria_1.Categoria.findOneBy({ id_categoria: producto.id_categoria });
    }
    catch (error) {
        return response.status(500).send({ mensaje: "Error al buscar categoria" });
    }
    if (!categoria)
        return response.status(404).send({ mensaje: "Categoria no encontrada" });
    //nuevo producto
    const newProducto = new Producto_1.Producto();
    newProducto.nombre = producto.nombre;
    newProducto.cantidad = producto.cantidad;
    newProducto.precio = producto.precio;
    newProducto.categoria = categoria;
    newProducto.descripcion = producto.descripcion;
    newProducto.imagen = producto.imagen;
    //guarda producto
    try {
        await newProducto.save();
    }
    catch (error) {
        return response.status(500).send({ mensaje: "Error al guardar Producto" });
    }
    return response.status(200).send({ mensaje: "Producto guardado con éxito" });
};
exports.saveProducto = saveProducto;
const getAllProducto = async (request, response) => {
    const { nombre, categoria } = request.query;
    const where = {};
    if (nombre)
        where.nombre = (0, typeorm_1.Like)("%" + nombre + "%");
    if (categoria)
        where.categoria = {
            id_categoria: categoria
        };
    console.log(where);
    let productos;
    try {
        productos = await Producto_1.Producto.find({
            relations: { categoria: true },
            where
        });
    }
    catch (error) {
        console.log(error);
        return response.status(500).send({ mensaje: "Error al buscar cateogrias", error });
    }
    return response.send({ mensaje: "encontrado con exito", data: productos });
};
exports.getAllProducto = getAllProducto;
const getProducto = async (request, response) => {
    let { id } = request.params;
    let producto;
    try {
        producto = await Producto_1.Producto.findOne({
            where: { id_producto: id },
            relations: { categoria: true }
        });
    }
    catch (error) {
        return response.status(500).send({ mensaje: "Error al buscar producto", error });
    }
    if (!producto)
        return response.status(404).send({ mensaje: "Producto no existe" });
    return response.send({ mensaje: "Producto encontrado con exito", data: producto });
};
exports.getProducto = getProducto;
const deleteProducto = async (request, response) => {
    let { id } = request.params;
    let producto;
    //buscar producto
    try {
        producto = await Producto_1.Producto.findOneBy({ id_producto: id });
    }
    catch (error) {
        return response.status(500).send({ mensaje: "Error al buscar producto", error });
    }
    //eliminar producto
    if (!producto)
        return response.status(404).send({ mensaje: "Producto no existe" });
    try {
        await producto.remove();
    }
    catch (error) {
        return response.status(500).send({ mensaje: "Error al eliminar producto", error });
    }
    return response.send({ mensaje: "Eliminado con éxito" });
};
exports.deleteProducto = deleteProducto;
const updateProducto = async (request, response) => {
    let { id } = request.params;
    let productoReq = request.body;
    const errorValidacion = validaProducto(productoReq);
    if (errorValidacion)
        return response.status(400).send({ mensaje: errorValidacion });
    let producto;
    //buscar producto
    try {
        producto = await Producto_1.Producto.findOne({
            where: { id_producto: id },
            relations: { categoria: true }
        });
    }
    catch (error) {
        return response.status(500).send({ mensaje: "Error al buscar producto", error });
    }
    if (!producto)
        return response.status(404).send({ mensaje: "Producto no existe" });
    let categoria;
    categoria = producto.categoria;
    if (producto?.categoria?.id_categoria != productoReq.id_categoria) {
        //busca categoria
        try {
            categoria = await Categoria_1.Categoria.findOneBy({ id_categoria: productoReq.id_categoria });
        }
        catch (error) {
            return response.status(500).send({ mensaje: "Error al buscar categoria" });
        }
        if (!categoria)
            return response.status(404).send({ mensaje: "Categoria no encontrada" });
    }
    // modificar datos producto
    producto.nombre = productoReq.nombre;
    producto.cantidad = productoReq.cantidad;
    producto.precio = productoReq.precio;
    producto.categoria = categoria;
    producto.descripcion = productoReq.descripcion;
    producto.imagen = productoReq.imagen;
    // modificar producto
    try {
        await producto.save();
    }
    catch (error) {
        return response.status(500).send({ mensaje: "Error al modificar producto", error });
    }
    return response.send({ mensaje: "Modificado con éxito" });
};
exports.updateProducto = updateProducto;
const validaProducto = (producto) => {
    const { nombre, cantidad, precio, id_categoria, descripcion, imagen } = producto;
    // valida nombre
    if (nombre == undefined)
        return "campo nombre es obligatorio";
    if (!(typeof nombre == "string"))
        return "campo nombre debe contener texto";
    if (nombre.trim().length < 1)
        return "campo nombre es obligatorio";
    // valida cantidad
    if (cantidad == undefined)
        return "campo cantidad es obligatorio";
    if (isNaN(cantidad))
        return "campo nombre debe ser numérico";
    // valida precio
    if (precio == undefined)
        return "campo precio es obligatorio";
    if (isNaN(precio))
        return "campo precio debe ser numérico";
    if (precio <= 0)
        return "campo precio debe ser mayor a cero";
    // valida id_categoria
    if (id_categoria == undefined)
        return "campo id_categoria es obligatorio";
    if (isNaN(id_categoria))
        return "campo id_categoria debe ser numérico";
    // valida descripcion
    if (descripcion == undefined)
        return "campo descripcion es obligatorio";
    if (!(typeof descripcion == "string"))
        return "campo descripcion debe contener texto";
    if (descripcion.trim().length < 1)
        return "campo descripcion es obligatorio";
    // valida imagen
    if (imagen == undefined)
        return "campo imagen es obligatorio";
    if (!(typeof imagen == "string"))
        return "campo imagen debe contener texto";
};
