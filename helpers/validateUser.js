const User = require('../models/userSchema');

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
    emailExists,
    userExists,
    userNameExists
}