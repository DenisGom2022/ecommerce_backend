"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoria = exports.getAllCategorias = exports.saveCategoria = void 0;
const Categoria_1 = require("../models/Categoria");
const saveCategoria = async (request, response) => {
    const categoria = request.body;
    //valida campos de categoria
    const validaError = validaCategoria(categoria);
    if (validaError)
        return response.status(400).send({ mensaje: validaError });
    //nueva categoria
    const newCategoria = new Categoria_1.Categoria();
    newCategoria.descripcion = categoria.descripcion;
    //guarda categoria
    try {
        await newCategoria.save();
    }
    catch (error) {
        if (error?.sqlMessage?.includes("idx_descripcion"))
            return response.status(400).send({ mensaje: "Categoria ya existe", error });
        return response.status(500).send({ mensaje: "Error al guardar", error });
    }
    return response.send({ mensaje: "guardado con éxito" });
};
exports.saveCategoria = saveCategoria;
const validaCategoria = (categoria) => {
    const { descripcion } = categoria;
    if (descripcion == undefined)
        return "campo descripcion es obligatorio";
    if (!(typeof descripcion == "string"))
        return "campo descripcion debe contener texto";
    if (descripcion.trim().length < 1)
        return "campo descripcion es obligatorio";
};
const getAllCategorias = async (request, response) => {
    let categorias;
    try {
        categorias = await Categoria_1.Categoria.find();
    }
    catch (error) {
        console.log(error);
        return response.status(500).send({ mensaje: "Error al buscar cateogrias", error });
    }
    return response.send({ mensaje: "encontrado con exito", data: categorias });
};
exports.getAllCategorias = getAllCategorias;
const deleteCategoria = async (request, response) => {
    let { id } = request.params;
    let categoria;
    //buscar categoria
    try {
        categoria = await Categoria_1.Categoria.findOneBy({ id_categoria: id });
    }
    catch (error) {
        return response.status(500).send({ mensaje: "Error al buscar cateogria", error });
    }
    //eliminar categoria
    if (!categoria)
        return response.status(404).send({ mensaje: "Categoria no existe" });
    try {
        await categoria.remove();
    }
    catch (error) {
        return response.status(500).send({ mensaje: "Error al eliminar categoria", error });
    }
    return response.send({ mensaje: "Eliminado con éxito" });
};
exports.deleteCategoria = deleteCategoria;
