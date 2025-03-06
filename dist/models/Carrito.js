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
exports.Carrito = void 0;
const typeorm_1 = require("typeorm");
const Usuario_1 = require("./Usuario");
const Item_carrito_1 = require("./Item_carrito");
let Carrito = class Carrito extends typeorm_1.BaseEntity {
};
exports.Carrito = Carrito;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Carrito.prototype, "id_carrito", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_1.Usuario, usuario => usuario.id_usuario),
    __metadata("design:type", Usuario_1.Usuario)
], Carrito.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Carrito.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Item_carrito_1.Item_carrito, item_carrito => item_carrito.carrito),
    __metadata("design:type", Array)
], Carrito.prototype, "items_carrito", void 0);
exports.Carrito = Carrito = __decorate([
    (0, typeorm_1.Entity)()
], Carrito);
