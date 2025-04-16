import { Request, Response } from "express";
import { Producto } from "../models/Producto";
import { Categoria } from "../models/Categoria";
import { Like } from "typeorm";

interface ProductoInterface {
    nombre:string,
    cantidad:number,
    precio:number,
    id_categoria:number,
    descripcion:string,
    imagen:string
}

export const saveProducto = async (request:Request, response:Response):Promise<any> => {
    const producto:ProductoInterface = request.body;
    const errorValidacion = validaProducto(producto);
    if(errorValidacion) return response.status(400).send({mensaje:errorValidacion});

    //busca categoria
    let categoria;
    try {
        categoria = await Categoria.findOneBy({id_categoria:producto.id_categoria});
    } catch (error) {
        return response.status(500).send({mensaje:"Error al buscar categoria"});
    }
    if(!categoria) return response.status(404).send({mensaje:"Categoria no encontrada"});


    //nuevo producto
    const newProducto = new Producto();
    newProducto.nombre = producto.nombre;
    newProducto.cantidad = producto.cantidad;
    newProducto.precio = producto.precio;
    newProducto.categoria = categoria
    newProducto.descripcion = producto.descripcion;
    newProducto.imagen = producto.imagen;

    //guarda producto
    try {
        await newProducto.save();
    } catch (error) {
        return response.status(500).send({mensaje:"Error al guardar Producto"});
    }

    return response.status(200).send({mensaje:"Producto guardado con éxito"});
}

export const getAllProducto = async (request:Request, response:Response):Promise<any> => {
    const { nombre, categoria } = request.query;
    const where:any = {};
    if(nombre) where.nombre = Like("%" + nombre + "%");
    if(categoria) where.categoria = {
        id_categoria: categoria
    };

    console.log(where)
    let productos; 
    try {
        productos = await Producto.find({
            relations:{categoria:true},
            where
        });
    }catch(error){
        console.log(error);
        return response.status(500).send({mensaje:"Error al buscar cateogrias", error});
    }

    return response.send({mensaje:"encontrado con exito", data:productos})
}

export const getProducto = async (request:Request, response:Response):Promise<any> => {
    let { id }:any = request.params;
    let producto;

    try{
        producto = await Producto.findOne({
            where: {id_producto:id},
            relations:{categoria: true}
        });
    }catch(error){
        return response.status(500).send({ mensaje:"Error al buscar producto", error });
    }

    if(!producto) return response.status(404).send({ mensaje:"Producto no existe" });
    
    return response.send({ mensaje:"Producto encontrado con exito", data:producto })
}

export const deleteProducto = async (request:Request, response:Response):Promise<any> => {
    let { id }:any = request.params;
    let producto;

    //buscar producto
    try{
        producto = await Producto.findOneBy({ id_producto:id });
    }catch(error){
        return response.status(500).send({ mensaje:"Error al buscar producto", error });
    }

    //eliminar producto
    if(!producto) return response.status(404).send({ mensaje:"Producto no existe" });
    try{
        await producto.remove();
    }catch(error){
        return response.status(500).send({ mensaje:"Error al eliminar producto", error });
    }

    return response.send({ mensaje:"Eliminado con éxito" });
}

export const updateProducto = async (request:Request, response:Response):Promise<any> => {
    let { id }:any = request.params;
    let productoReq:ProductoInterface = request.body;    
    const errorValidacion = validaProducto(productoReq);
    if(errorValidacion) return response.status(400).send({mensaje:errorValidacion});
    let producto;

    //buscar producto
    try{
        producto = await Producto.findOne({
            where: {id_producto:id},
            relations: {categoria:true}
        });
    }catch(error){
        return response.status(500).send({ mensaje:"Error al buscar producto", error });
    }
    if(!producto) return response.status(404).send({ mensaje:"Producto no existe" });
    
    let categoria;
    categoria = producto.categoria;     
    
    if(producto?.categoria?.id_categoria != productoReq.id_categoria){
        //busca categoria
        try {
            categoria = await Categoria.findOneBy({id_categoria:productoReq.id_categoria});
        } catch (error) {
            return response.status(500).send({mensaje:"Error al buscar categoria"});
        }
        if(!categoria) return response.status(404).send({mensaje:"Categoria no encontrada"});
    }
    
    // modificar datos producto
    producto.nombre = productoReq.nombre;
    producto.cantidad = productoReq.cantidad;
    producto.precio = productoReq.precio;
    producto.categoria = categoria;
    producto.descripcion = productoReq.descripcion;
    producto.imagen = productoReq.imagen;

    // modificar producto
    try{
        await producto.save();
    }catch(error){
        return response.status(500).send({ mensaje:"Error al modificar producto", error });
    }

    return response.send({ mensaje:"Modificado con éxito" });
}

const validaProducto = (producto:ProductoInterface) => {    
    const { nombre, cantidad, precio, id_categoria, descripcion, imagen } = producto;
    // valida nombre
    if(nombre == undefined) return "campo nombre es obligatorio";
    if(!(typeof nombre == "string")) return "campo nombre debe contener texto";
    if(nombre.trim().length < 1) return "campo nombre es obligatorio";

    // valida cantidad
    if(cantidad == undefined) return "campo cantidad es obligatorio";
    if(isNaN(cantidad)) return "campo nombre debe ser numérico";

     // valida precio
     if(precio == undefined) return "campo precio es obligatorio";
     if(isNaN(precio)) return "campo precio debe ser numérico";
     if(precio <= 0) return "campo precio debe ser mayor a cero";

    // valida id_categoria
    if(id_categoria == undefined) return "campo id_categoria es obligatorio";
    if(isNaN(id_categoria)) return "campo id_categoria debe ser numérico";

    // valida descripcion
    if(descripcion == undefined) return "campo descripcion es obligatorio";
    if(!(typeof descripcion == "string")) return "campo descripcion debe contener texto";
    if(descripcion.trim().length < 1) return "campo descripcion es obligatorio";

    // valida imagen
    if(imagen == undefined) return "campo imagen es obligatorio";
    if(!(typeof imagen == "string")) return "campo imagen debe contener texto";
}