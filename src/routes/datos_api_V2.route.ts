import { Router } from "express";
import { datosApi } from "../controllers/datos_api_V2.controller";

export const routerDatosApiV2 = Router();

routerDatosApiV2.get("/", datosApi)