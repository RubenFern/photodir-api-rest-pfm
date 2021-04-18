const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema
({
    name:
    {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
        unique: true
    },

    email:
    {
        type: String,
        required: [true, 'El E-Mail es obligatorio'],
        unique: true
    },

    password:
    {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },

    image:
    {
        type: String,
        default: "user_image.jpg"
    },

    is_admin:
    {
        type: Boolean,
        default: false
    }
});

// Impido que el JSON me devuelva la contraseña y la versión para tener solo los datos del usuario con los que trabajar
UsuarioSchema.methods.toJSON = function()
{
    const {__v, password, _id, ...usuario} = this.toObject();

    // Cambio el nombre de _id a uid
    usuario.uid = _id;

    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);