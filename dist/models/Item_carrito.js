"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item_carrito = void 0;
const typeorm_1 = require("typeorm");
const Carrito_1 = require("./Carrito");
const Producto_1 = require("./Producto");
let Item_carrito = class Item_carrito extends typeorm_1.BaseEntity {
};
exports.Item_carrito = Item_carrito;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Item_carrito.prototype, "id_item_carrito", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Carrito_1.Carrito, carrito => carrito.items_carrito),
    __metadata("design:type", Carrito_1.Carrito)
], Item_carrito.prototype, "carrito", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Producto_1.Producto, producto => producto.id_producto),
    __metadata("design:type", Producto_1.Producto)
], Item_carrito.prototype, "producto", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Item_carrito.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "double", precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], Item_carrito.prototype, "subtotal", void 0);
exports.Item_carrito = Item_carrito = __decorate([
    (0, typeorm_1.Entity)()
], Item_carrito);
