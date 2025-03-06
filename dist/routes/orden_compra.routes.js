"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerOrdenCompra = void 0;
const express_1 = require("express");
const orden_compra_controller_1 = require("../controllers/orden_compra.controller");
exports.routerOrdenCompra = (0, express_1.Router)();
exports.routerOrdenCompra.post("/", orden_compra_controller_1.comprarCarrito);
exports.routerOrdenCompra.get("/", orden_compra_controller_1.getAllOrdenesCompra);
exports.routerOrdenCompra.get("/:id_usuario", orden_compra_controller_1.getOrdenesCompraByUsuario);
