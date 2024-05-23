//importacion de libs
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authRutas = require('./rutas/authRutas');
const Usuario = require('./models/Usuario');
require('dotenv').config();
const app = express();
//ruta
const productoRutas = require('./rutas/productoRutas');
const salidasRutas = require('./rutas/salidasRutas');
//conifg enviornment
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
//JSON
app.use(express.json());
//CONEXION CON MONGO
mongoose.connect(MONGO_URI)
.then(() => {
        console.log('Conexion Exitosa');
        app.listen(PORT, () => {console.log("Servidor Express Corriendo en el puerto: " + PORT)})
    }
).catch( error => console.log('error de conexion', error));

const autenticar = async (req, res, next) =>{
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if(!token)
            res.status(401).json({error: 'NO existe el Token!'});
        const decodificar = jwt.verify(token, 'clave_secreta');
        req.usuario = await Usuario.findById(decodificar.usuarioId);
        next();
    } catch (error) {
        res.status(400).json({error: 'Token Invalido!'});
    }
}

app.use('/auth', authRutas);
app.use('/productos', autenticar, productoRutas);
app.use('/salidas', autenticar, salidasRutas);

//utilizar las rutas
//app.use('/productos', productoRutas);