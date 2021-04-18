const { validationResult } = require('express-validator');
const User = require('../models/usuarioSchema');

const validateUser = (req, res, next) =>
{
    const errors = validationResult(req);

    if (!errors.isEmpty())
    {
        return res.status(400).json(errors);
    }

    next();
}

const emailExists = async(email) =>
{
    const existeEmail = await User.findOne({email});

    if (existeEmail)
    {
        throw new Error('El correo electrónico ya existe');
    }
}

const userExists = async(user_name) =>
{
    const existeUsuario = await User.findOne({user_name});

    if (!existeUsuario)
    {
        throw new Error('El usuario no existe');
    }
}

const userNameExists = async(user_name) =>
{
    const existeUsuario = await User.findOne({user_name});

    if (existeUsuario)
    {
        throw new Error('El nombre de usuario no está disponible');
    }

}

module.exports = 
{
    validateUser,
    emailExists,
    userExists,
    userNameExists
}