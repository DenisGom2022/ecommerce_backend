import { Router } from "express";
import { deleteCategoria, getAllCategorias, saveCategoria } from "../controllers/categoria.controller";

export const routerCategoria = Router();

routerCategoria.post("/", saveCategoria);
routerCategoria.get("/", getAllCategorias);
routerCategoria.delete("/:id", deleteCategoria)