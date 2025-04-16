import { Router } from "express";
import { addPromocion } from "../controllers/promocion.controller";
import { validatePromocion } from "../validators/validatePromocion";

export const routerPromocion = Router();

routerPromocion.post("", validatePromocion, addPromocion);
