const mongoose = require('mongoose');
//definir el esquema
const productoSchema = new mongoose.Schema({
    //codigo:{type: String, require: true}
    codigo: String,
    nombre: String,
    descripcion: String,
    cantidad: Number,
    marca: String,
    modelo: String,
    lote: String,
    sn: String,
    procedencia: String,
    fecha_llegada: Date,
    fecha_vencimiento: Date
});

const productoModel = mongoose.model('producto',productoSchema, 'inventario');
module.exports = productoModel;