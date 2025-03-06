"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerCategoria = void 0;
const express_1 = require("express");
const categoria_controller_1 = require("../controllers/categoria.controller");
exports.routerCategoria = (0, express_1.Router)();
exports.routerCategoria.post("/", categoria_controller_1.saveCategoria);
exports.routerCategoria.get("/", categoria_controller_1.getAllCategorias);
exports.routerCategoria.delete("/:id", categoria_controller_1.deleteCategoria);
