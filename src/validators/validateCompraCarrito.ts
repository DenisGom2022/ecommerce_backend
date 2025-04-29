import { body } from "express-validator";

export const validaCompraCarrito = [
    body("id_usuario")
        .notEmpty()
        .withMessage("Campo id_usuario es obligatorio")
        .isNumeric()
        .withMessage("Campo id_usuario debe ser un número")
        .toInt(), // Convierte a número

    body("metodo_de_pago")
        .notEmpty()
        .withMessage("Campo metodo_de_pago es obligatorio")
        .isString()
        .withMessage("Campo metodo_de_pago debe contener texto")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Campo metodo_de_pago es obligatorio"),

    body("direccion_envio")
        .notEmpty()
        .withMessage("Campo direccion_envio es obligatorio")
        .isString()
        .withMessage("Campo direccion_envio debe contener texto")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Campo direccion_envio es obligatorio"),

    body("canal")
        .notEmpty()
        .withMessage("Campo canal es obligatorio")
        .isString()
        .withMessage("Campo canal debe contener texto")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Campo canal es obligatorio"),
];
