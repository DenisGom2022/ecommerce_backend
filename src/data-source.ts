import "reflect-metadata"
import { DataSource } from "typeorm"
import { Categoria } from "./models/Categoria"
import { Producto } from "./models/Producto"
import { Usuario } from "./models/Usuario"
import { Carrito } from "./models/Carrito"
import { Item_carrito } from "./models/Item_carrito"
import { Orden_compra } from "./models/Orden_compra"
import { Item_orden_compra } from "./models/Item_orden_compra"


export const AppDataSource = new DataSource({
    type: "mysql",
    host: "mysql-aerolineaia2025.alwaysdata.net",
    port: 3306,
    username: "400640",
    password: "AlwaysData2025",
    database: "aerolineaia2025_aerolinea",
    synchronize: true,
    logging: false,
    entities: [Categoria, Producto, Usuario, Carrito, Item_carrito, Orden_compra, Item_orden_compra],
    migrations: [],
    subscribers: [],
})
