import { AppDataSource } from "./data-source";
import express from "express";
import cors from 'cors';
import { routerCategoria } from "./routes/categoria.routes";
import { routerProducto } from "./routes/producto.routes";
import { routerUsuario } from "./routes/usuario.routes";
import { routerCarrito } from "./routes/carrito.routes";
import { routerOrdenCompra } from "./routes/orden_compra.routes";

const PORT = process.env.PORT || 3006;

AppDataSource.initialize().then( async () => {
    const app = express();
    app.use(express.json());
    app.use(cors());

    app.use("/categoria", routerCategoria);
    app.use("/producto", routerProducto);
    app.use("/usuario", routerUsuario);
    app.use("/carrito", routerCarrito);
    app.use("/orden-compra", routerOrdenCompra);

    app.listen(PORT, () => {
        console.log("Server running at http://localhost:" + PORT);
    })
}).catch(error => console.log(error));