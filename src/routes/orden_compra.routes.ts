import { Router } from "express";
import { comprarCarrito, getAllOrdenesCompra, getOrdenesCompraByUsuario } from "../controllers/orden_compra.controller";

export const routerOrdenCompra = Router();

routerOrdenCompra.post("/", comprarCarrito);
routerOrdenCompra.get("/", getAllOrdenesCompra);
routerOrdenCompra.get("/:id_usuario", getOrdenesCompraByUsuario);