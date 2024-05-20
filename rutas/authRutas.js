const express = require('express');
const rutas = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Registro
rutas.post('/registroUsuarios', async (req, res) =>{
    try {
        const {nombreusuario, correo, contrasenia} = req.body;
        const usuario = new Usuario({nombreusuario, correo, contrasenia});
        await usuario.save();
        res.status(201).json({mensaje: 'Usuario Registrado'});
    } catch (error) {
        res.sendStatus(500).json({mensaje: error.message});
    }
});

rutas.post('/iniciarsesion', async (req, res) => {
    try {
        const { correo, contrasenia } = req.body;
        const usuario = await Usuario.findOne({ correo });
        if (!usuario)
            return res.status(401).json({error: 'Usuario Invalido'});
        const validarContrasenia = await usuario.CompararContrasenia(contrasenia);
        if  (!validarContrasenia)
            return res.status(401).json({error: 'Contrasenia Invalida'});
        //Creacion de token
        const token = jwt.sign({usuarioId: usuario._id}, 'clave_secreta', {expiresIn: '1h'});
        res.json({token});
    } catch (error) {
        res.status(500).json({mensaje: error.message});
    }
});
module.exports = rutas;