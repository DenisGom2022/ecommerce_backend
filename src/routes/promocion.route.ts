import { Router } from "express";
import { addPromocion, deletePromocion, getAllPromociones } from "../controllers/promocion.controller";
import { validatePromocion } from "../validators/validatePromocion";
import { validateDeletePromocion } from "../validators/validateDeletePromocion";

export const routerPromocion = Router();

routerPromocion.post("", validatePromocion, addPromocion);
routerPromocion.get("", getAllPromociones);
routerPromocion.delete("/:id_producto", validateDeletePromocion, deletePromocion);