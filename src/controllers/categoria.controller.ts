import { Request, Response } from "express";
import { Categoria } from "../models/Categoria";

interface CategoriaInterface {
    descripcion:string
}

export const saveCategoria = async (request:Request, response:Response):Promise<any> => {
    const categoria:CategoriaInterface = request.body;

    //valida campos de categoria
    const validaError = validaCategoria(categoria);
    if(validaError) return response.status(400).send({mensaje:validaError});

    //nueva categoria
    const newCategoria = new Categoria();
    newCategoria.descripcion = categoria.descripcion;

    //guarda categoria
    try{         
        await newCategoria.save();
    }catch(error:any){
        if(error?.sqlMessage?.includes("idx_descripcion")) return response.status(400).send({mensaje:"Categoria ya existe", error});
        return response.status(500).send({mensaje:"Error al guardar", error});
    }

    return response.send({mensaje:"guardado con éxito"});
}

const validaCategoria = (categoria:CategoriaInterface) => {
    const { descripcion } = categoria;
    if(descripcion == undefined) return "campo descripcion es obligatorio";
    if(!(typeof descripcion == "string")) return "campo descripcion debe contener texto";
    if(descripcion.trim().length < 1) return "campo descripcion es obligatorio";
}

export const getAllCategorias = async (request:Request, response:Response):Promise<any> => {
    let categorias; 
    try {
        categorias = await Categoria.find();
    }catch(error){
        console.log(error);
        return response.status(500).send({mensaje:"Error al buscar cateogrias", error});
    }

    return response.send({mensaje:"encontrado con exito", data:categorias})
}

export const deleteCategoria = async (request:Request, response:Response):Promise<any> => {
    let { id }:any = request.params;
    let categoria;

    //buscar categoria
    try{
        categoria = await Categoria.findOneBy({ id_categoria:id });
    }catch(error){
        return response.status(500).send({ mensaje:"Error al buscar cateogria", error });
    }

    //eliminar categoria
    if(!categoria) return response.status(404).send({ mensaje:"Categoria no existe" });
    try{
        await categoria.remove();
    }catch(error){
        return response.status(500).send({ mensaje:"Error al eliminar categoria", error });
    }

    return response.send({ mensaje:"Eliminado con éxito" })
}