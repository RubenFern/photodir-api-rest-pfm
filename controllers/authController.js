const bcryptjs = require('bcryptjs');
const {request, response} = require('express');

const User = require('../models/usuarioSchema');

const generarJWT = require('../helpers/generarJWT');

const login = async(req = request, res = response) =>
{
    const {user_name, password} = req.body;

    try
    {
        // Compruebo el nombre de usuario
        const user = await User.findOne({user_name});

        if (!user)
        {
            return res.status(400).json({
                message: 'El nombre de usuario no es correcto'
            });
        }

        // Compruebo la contraseña usando la password recibida en el body con la del usuario que busqué con el email
        const passwordValida = bcryptjs.compareSync(password, user.password);

        if (!passwordValida)
        {
            return res.status(400).json({
                message: 'La contraseña no es correcta'
            });
        }

        // Genero el Token
        const token = await generarJWT(user.id);

        res.json({
            message: 'Login ok',
            user,
            token
        });
    } catch (error)
    {
        console.log(error);
        return res.status(500).json({
            message: 'Ha ocurrido un error al iniciar sesión'
        });
    }   
}

module.exports = {
    login
}