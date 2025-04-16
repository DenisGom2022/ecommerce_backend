import { body } from "express-validator";

export const validatePromocion = [
    body("fecha_inicio")
        .bail() // Detiene la validación si falla
        .isISO8601()
        .withMessage('La fecha de inicio debe tener formato YYYY-MM-DD')
        .bail()
        .toDate(), // Convierte a Date

    body('fecha_fin')
        .bail()
        .isISO8601()
        .withMessage('La fecha de fin debe tener formato YYYY-MM-DD')
        .bail()
        .toDate()
        .custom((value, { req }) => {
            if (value <= req.body.fecha_inicio) {
                throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
            }
            return true;
        }),

    body('descuento')
        .bail()
        .isFloat({ min: 0 })
        .withMessage('El descuento debe ser un número entre 0 y 100'),

    body('id_producto')
        .bail()
        .isInt({ gt: 0 })
        .withMessage('El ID del producto debe ser un número entero positivo'),
];