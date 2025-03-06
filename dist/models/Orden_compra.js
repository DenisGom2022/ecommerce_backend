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
exports.Orden_compra = void 0;
const typeorm_1 = require("typeorm");
const Usuario_1 = require("./Usuario");
const Item_orden_compra_1 = require("./Item_orden_compra");
let Orden_compra = class Orden_compra extends typeorm_1.BaseEntity {
};
exports.Orden_compra = Orden_compra;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Orden_compra.prototype, "id_orden_compra", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_1.Usuario, usuario => usuario.id_usuario),
    __metadata("design:type", Usuario_1.Usuario)
], Orden_compra.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "double", precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], Orden_compra.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Orden_compra.prototype, "metodo_de_pago", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Orden_compra.prototype, "direccion_envio", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Orden_compra.prototype, "fecha_compra", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Item_orden_compra_1.Item_orden_compra, item => item.orden_compra),
    __metadata("design:type", Array)
], Orden_compra.prototype, "items_orden_compra", void 0);
exports.Orden_compra = Orden_compra = __decorate([
    (0, typeorm_1.Entity)()
], Orden_compra);
