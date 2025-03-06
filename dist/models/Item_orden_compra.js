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
exports.Item_orden_compra = void 0;
const typeorm_1 = require("typeorm");
const Orden_compra_1 = require("./Orden_compra");
const Producto_1 = require("./Producto");
let Item_orden_compra = class Item_orden_compra extends typeorm_1.BaseEntity {
};
exports.Item_orden_compra = Item_orden_compra;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Item_orden_compra.prototype, "id_item_orden_compra", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Orden_compra_1.Orden_compra, orden_compra => orden_compra.items_orden_compra),
    __metadata("design:type", Orden_compra_1.Orden_compra)
], Item_orden_compra.prototype, "orden_compra", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Producto_1.Producto, producto => producto.id_producto),
    __metadata("design:type", Producto_1.Producto)
], Item_orden_compra.prototype, "producto", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Item_orden_compra.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "double", precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], Item_orden_compra.prototype, "subtotal", void 0);
exports.Item_orden_compra = Item_orden_compra = __decorate([
    (0, typeorm_1.Entity)()
], Item_orden_compra);
