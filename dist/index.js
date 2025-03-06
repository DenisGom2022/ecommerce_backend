"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./data-source");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const categoria_routes_1 = require("./routes/categoria.routes");
const producto_routes_1 = require("./routes/producto.routes");
const usuario_routes_1 = require("./routes/usuario.routes");
const carrito_routes_1 = require("./routes/carrito.routes");
const orden_compra_routes_1 = require("./routes/orden_compra.routes");
const PORT = process.env.PORT || 3006;
data_source_1.AppDataSource.initialize().then(async () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.use("/categoria", categoria_routes_1.routerCategoria);
    app.use("/producto", producto_routes_1.routerProducto);
    app.use("/usuario", usuario_routes_1.routerUsuario);
    app.use("/carrito", carrito_routes_1.routerCarrito);
    app.use("/orden-compra", orden_compra_routes_1.routerOrdenCompra);
    app.listen(PORT, () => {
        console.log("Server running at http://localhost:" + PORT);
    });
}).catch(error => console.log(error));
