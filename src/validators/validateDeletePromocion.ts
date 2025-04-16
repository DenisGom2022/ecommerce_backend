import { param } from "express-validator";

export const validateDeletePromocion = [
    param('id_producto')
            .bail()
            .isInt({ gt: 0 })
            .withMessage('El ID del producto debe ser un número entero positivo')
]