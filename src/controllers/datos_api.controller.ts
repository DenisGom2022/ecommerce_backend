import { Request, Response } from "express";
import { getAllProducto } from "./producto.controller"
import { Producto } from "../models/Producto";

export const datosApi = async (request: Request, response: Response): Promise<any> => {
    const productos = await Producto.find();

    const datos = {
        productos
    }

    return response.send(datos);
}