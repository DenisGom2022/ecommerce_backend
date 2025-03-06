"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsuarios = exports.iniciarSesion = exports.saveUsuario = void 0;
const Usuario_1 = require("../models/Usuario");
const data_source_1 = require("../data-source");
const saveUsuario = async (request, response) => {
    const usuarioData = request.body;
    // Valida campos de usuario
    const validaError = validaUsuario(usuarioData);
    if (validaError)
        return response.status(400).send({ mensaje: validaError });
    // Nuevo usuario
    const newUsuario = new Usuario_1.Usuario();
    newUsuario.usuario = usuarioData.usuario;
    newUsuario.nombre = usuarioData.nombre;
    newUsuario.contrasena = usuarioData.contrasena;
    // Guarda usuario
    try {
        await newUsuario.save();
    }
    catch (error) {
        console.log(error);
        if (error?.sqlMessage?.includes("idx_usuario"))
            return response.status(400).send({ mensaje: "Usuario ya existe", error });
        return response.status(500).send({ mensaje: "Error al guardar", error });
    }
    return response.send({ mensaje: "Guardado con éxito" });
};
exports.saveUsuario = saveUsuario;
const validaUsuario = (usuario) => {
    const { usuario: username, nombre, contrasena } = usuario;
    if (username == undefined)
        return "Campo usuario es obligatorio";
    if (!(typeof username == "string"))
        return "Campo usuario debe contener texto";
    if (username.trim().length < 1)
        return "Campo usuario es obligatorio";
    if (nombre == undefined)
        return "Campo nombre es obligatorio";
    if (!(typeof nombre == "string"))
        return "Campo nombre debe contener texto";
    if (nombre.trim().length < 1)
        return "Campo nombre es obligatorio";
    if (contrasena == undefined)
        return "Campo contraseña es obligatorio";
    if (!(typeof contrasena == "string"))
        return "Campo contraseña debe contener texto";
    if (contrasena.trim().length < 1)
        return "Campo contraseña es obligatorio";
};
const iniciarSesion = async (request, response) => {
    const loginData = request.body;
    // Valida campos de inicio de sesión
    const validaError = validaLogin(loginData);
    if (validaError)
        return response.status(400).send({ mensaje: validaError });
    // Busca usuario en la base de datos
    const usuarioRepository = data_source_1.AppDataSource.getRepository(Usuario_1.Usuario);
    let usuario;
    try {
        usuario = await usuarioRepository.findOneOrFail({ where: { usuario: loginData.usuario } });
    }
    catch (error) {
        return response.status(400).send({ mensaje: "Usuario no encontrado" });
    }
    // Verifica la contraseña
    if (usuario.contrasena !== loginData.contrasena) {
        return response.status(400).send({ mensaje: "Contraseña incorrecta" });
    }
    // Inicio de sesión exitoso
    return response.send({ mensaje: "Inicio de sesión exitoso", usuario });
};
exports.iniciarSesion = iniciarSesion;
const validaLogin = (login) => {
    const { usuario, contrasena } = login;
    if (usuario == undefined)
        return "Campo usuario es obligatorio";
    if (!(typeof usuario == "string"))
        return "Campo usuario debe contener texto";
    if (usuario.trim().length < 1)
        return "Campo usuario es obligatorio";
    if (contrasena == undefined)
        return "Campo contraseña es obligatorio";
    if (!(typeof contrasena == "string"))
        return "Campo contraseña debe contener texto";
    if (contrasena.trim().length < 1)
        return "Campo contraseña es obligatorio";
};
const getUsuarios = async (request, response) => {
    try {
        const usuarios = await Usuario_1.Usuario.find({
            select: ["id_usuario", "usuario", "nombre"] // Selecciona solo los campos que quieres devolver
        });
        return response.send(usuarios);
    }
    catch (error) {
        return response.status(500).send({ mensaje: "Error al obtener usuarios", error });
    }
};
exports.getUsuarios = getUsuarios;
