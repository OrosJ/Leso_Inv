const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const usuarioSchema = new mongoose.Schema({
    nombreusuario: {
        type: String,
        required :true,
        unique : true
    },
    correo:{
        type: String,
        required :true,
        unique : true
    },
    contrasenia :{
        type: String,
        required :true,
        unique : true
    },
    tokensInvalidos: [String]
});



//hash
usuarioSchema.pre('save', async function (next){
    if  (this.isModified('contrasenia')){
        this.contrasenia = await bcrypt.hash(this.contrasenia, 10);
    }
    next();
});

//Cerrar Sesion
usuarioSchema.statics.cerrarSesion = async function(token) {
    try {
        // Agregar el token a la lista de tokens inválidos
        await this.findOneAndUpdate({ tokensInvalidos: { $ne: token } }, { $push: { tokensInvalidos: token } });
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
};

//comparar contrasenia
usuarioSchema.methods.CompararContrasenia = async function (contraseniaComparar){
    return await bcrypt.compare(contraseniaComparar, this.contrasenia);
};


const UsuarioModel = mongoose.model('Usuario',usuarioSchema, 'usuario');
module.exports = UsuarioModel;