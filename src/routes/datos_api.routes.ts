import { Router } from "express";
import { datosApi } from "../controllers/datos_api.controller";

export const routerDatosApi = Router();

routerDatosApi.get("/", datosApi)