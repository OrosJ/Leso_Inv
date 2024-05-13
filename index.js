//importacion de libs
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
//ruta
const productoRutas = require('./rutas/productoRutas');
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

//utilizar las rutas de las recetas
app.use('/productos', productoRutas);