import { Router } from "express";
import { getUsuarios, iniciarSesion, saveUsuario } from "../controllers/usuario.controller";

export const routerUsuario = Router();

routerUsuario.post("/", saveUsuario);
routerUsuario.get("/", getUsuarios);
routerUsuario.post("/sesion", iniciarSesion);
