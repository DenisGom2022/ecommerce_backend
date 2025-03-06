"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerUsuario = void 0;
const express_1 = require("express");
const usuario_controller_1 = require("../controllers/usuario.controller");
exports.routerUsuario = (0, express_1.Router)();
exports.routerUsuario.post("/", usuario_controller_1.saveUsuario);
exports.routerUsuario.get("/", usuario_controller_1.getUsuarios);
exports.routerUsuario.post("/sesion", usuario_controller_1.iniciarSesion);
