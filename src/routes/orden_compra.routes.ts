import { Router } from "express";
import { comprarCarrito, getAllOrdenesCompra, getOrdenesCompraByUsuario } from "../controllers/orden_compra.controller";
import { validaCompraCarrito } from "../validators/validateCompraCarrito";

export const routerOrdenCompra = Router();

routerOrdenCompra.post("/", validaCompraCarrito, comprarCarrito);
routerOrdenCompra.get("/", getAllOrdenesCompra);
routerOrdenCompra.get("/:id_usuario", getOrdenesCompraByUsuario);