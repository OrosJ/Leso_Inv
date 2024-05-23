const mongoose = require('mongoose');
const salidaSchema = new mongoose.Schema({

    codigo: String,
    fecha_salida: Date,
    producto: {type: mongoose.Schema.Types.ObjectId, ref: 'producto'},
    cantidad: String,
    destino: String

});

const salidaModel = mongoose.model('salida', salidaSchema, 'salida');
module.exports = salidaModel;