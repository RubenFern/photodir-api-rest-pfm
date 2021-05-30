const bcryptjs = require('bcryptjs');
const {request, response} = require('express');

const User = require('../models/userSchema');

const generateJWT = require('../helpers/generateJWT');
const deleteJWT = require('../helpers/deleteJWT');

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
                message: 'Los datos no son correctos',
                logged: false,
            });
        }

        // Compruebo la contraseña usando la password recibida en el body con la del usuario
        const validPassword = bcryptjs.compareSync(password, user.password);

        if (!validPassword)
        {
            return res.status(400).json({
                message: 'Los datos no son correctos',
                logged: false,
            });
        }

        // Genero el Token
        const token = await generateJWT(user.id);

        res.json({
            logged: true,
            user,
            token
        });
    } catch (error)
    {
        console.log(error);
        return res.status(500).json({
            message: 'Ha ocurrido un error al iniciar sesión',
            logged: false,
        });
    }   
}

// Endpoint para añadir el Token a la lista negra
const logout = (req = request, res = response) =>
{
    // Añado el token en la lista negra
    deleteJWT(req, res);

    res.json({
        message: 'El usuario se ha desconectado'
    }); 
}

module.exports = {
    login,
    logout
}