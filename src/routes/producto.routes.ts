import { Router } from "express";
import { deleteProducto, getAllProducto, getProducto, saveProducto, updateProducto } from "../controllers/producto.controller";

export const routerProducto = Router();
routerProducto.post("/", saveProducto);
routerProducto.get("/", getAllProducto);
routerProducto.get("/:id", getProducto);
routerProducto.delete("/:id", deleteProducto);
routerProducto.put("/:id", updateProducto);