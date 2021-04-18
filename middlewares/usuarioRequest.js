const { validationResult } = require('express-validator');
const usuario = require('../models/usuario');

const validarUsuario = (req, res, next) =>
{
    const errors = validationResult(req);

    if (!errors.isEmpty())
    {
        return res.status(400).json(errors);
    }

    next();
}

const existeEmail = async(email) =>
{
    const existeEmail = await usuario.findOne({email});

    if (existeEmail)
    {
        throw new Error('El correo electrónico ya existe');
    }
}

const existeUsuario = async(id) =>
{
    const existeUsuario = await usuario.findById(id);

    if (!existeUsuario)
    {
        throw new Error('El usuario no existe');
    }
}

module.exports = 
{
    validarUsuario,
    existeEmail,
    existeUsuario
}