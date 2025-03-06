import { Router } from "express";
import { addItemToCarrito, getAllCarritos, getAllCarritosDeUsuario, removeItemCantFromCarrito, removeItemFromCarrito } from "../controllers/carrito.controller";

export const routerCarrito = Router();

routerCarrito.post("/", addItemToCarrito);
routerCarrito.get("/", getAllCarritos); 
routerCarrito.get("/:id", getAllCarritosDeUsuario);
routerCarrito.patch("/", removeItemCantFromCarrito);
routerCarrito.post("/remove-item", removeItemFromCarrito);