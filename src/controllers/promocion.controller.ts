import { Request, Response } from "express";
import { Promocion } from "../models/Promocion";
import { validationResult } from "express-validator";
import { Producto } from "../models/Producto";
import { EntityNotFoundError } from "typeorm";

interface PromocionInterface {
    fecha_inicio: Date;
    fecha_fin: Date;
    descuento: number;
    id_producto: number;
}


export const addPromocion = async (request:Request, response:Response):Promise<any> => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ mensaje: errors.array()[0].msg });
    }
    const { id_producto, fecha_inicio, fecha_fin, descuento }:PromocionInterface = request.body;
    let productoFind:Producto|null = null;
    try {        
        productoFind = await Producto.findOneByOrFail({ id_producto });;
    } catch (error:any) {
        if(error instanceof EntityNotFoundError) {
            return response.status(404).send({ mensaje: "Producto no encontrado" });
        }
        return response.status(500).send({ mensaje: "Error al buscar producto" });
    }

    if(productoFind.promocion) {
        return response.status(400).send({ mensaje: "El producto ya tiene una promoción vigente" });
    }

    const promocion:Promocion = new Promocion();
    promocion.fecha_inicio = fecha_inicio;
    promocion.fecha_fin = fecha_fin;
    promocion.descuento = descuento;
    try {
        await promocion.save();
    } catch (error) {
        return response.status(500).send({ mensaje: "Error al guardar promocion" });
    }

    productoFind.promocion = promocion;
    try {
        await productoFind.save();
    }
    catch (error) { 
        return response.status(500).send({ mensaje: "Error al guardar producto" });
    }
    return response.status(200).send({ mensaje: "Promocion guardada con éxito" });
};


export const getAllPromociones = async (request:Request, response:Response):Promise<any> => {
    let promociones:Promocion[] = [];
    try {
        promociones = await Promocion.find();
    } catch (error) {
        return response.status(500).send({ mensaje: "Error al buscar promociones" });
    }
    return response.status(200).send(promociones);
}


export const deletePromocion = async (request:Request, response:Response):Promise<any> => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ mensaje: errors.array()[0].msg });
    }
    const { id_producto }:any = request.params;
    let productoFind:Producto|null = null;
    try {        
        productoFind = await Producto.findOneByOrFail({ id_producto });
    } catch (error:any) {
        if(error instanceof EntityNotFoundError) {
            return response.status(404).send({ mensaje: "Producto no encontrado", productoFind });
        }
        return response.status(500).send({ mensaje: "Error al buscar producto" });
    }
    if(!productoFind.promocion) {
        return response.status(400).send({ mensaje: "El producto no tiene una promoción vigente" });
    }
    let promocionFind:Promocion|null = null;
    try {
        promocionFind = await Promocion.findOneByOrFail({ id_promocion: productoFind.promocion.id_promocion });
    }
    catch (error:any) {
        if(error instanceof EntityNotFoundError) {
            return response.status(404).send({ mensaje: "Promocion no encontrada" });
        }
        return response.status(500).send({ mensaje: "Error al buscar promocion" });
    }

    productoFind.promocion = null;
    try {
        await productoFind.save();
    }
    catch (error) {
        return response.status(500).send({ mensaje: "Error al guardar producto" });
    }    
    
    try {
        await promocionFind.remove();
    }
    catch (error) {
        return response.status(500).send({ mensaje: "Error al eliminar promocion" });
    }

    return response.status(200).send({ mensaje: "Promocion eliminada con éxito" });
}