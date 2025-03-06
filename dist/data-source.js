"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Categoria_1 = require("./models/Categoria");
const Producto_1 = require("./models/Producto");
const Usuario_1 = require("./models/Usuario");
const Carrito_1 = require("./models/Carrito");
const Item_carrito_1 = require("./models/Item_carrito");
const Orden_compra_1 = require("./models/Orden_compra");
const Item_orden_compra_1 = require("./models/Item_orden_compra");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "mysql-aerolineaia2025.alwaysdata.net",
    port: 3306,
    username: "400640",
    password: "AlwaysData2025",
    database: "aerolineaia2025_aerolinea",
    synchronize: true,
    logging: false,
    entities: [Categoria_1.Categoria, Producto_1.Producto, Usuario_1.Usuario, Carrito_1.Carrito, Item_carrito_1.Item_carrito, Orden_compra_1.Orden_compra, Item_orden_compra_1.Item_orden_compra],
    migrations: [],
    subscribers: [],
});
