const bcryptjs = require('bcryptjs');
const {request, response} = require('express');

const Usuario = require('./../models/usuario');

const generarJWT = require('../helpers/generarJWT');

const login = async(req = request, res = response) =>
{
    const {email, password} = req.body;

    try
    {
        // Compruebo el email
        const usuario = await Usuario.findOne({email});

        if (!usuario)
        {
            return res.status(400).json({
                message: 'El correo electrónico no es correcto'
            });
        }

        // Compruebo la contraseña usando la password recibida en el body con la del usuario que busqué con el email
        const passwordValida = bcryptjs.compareSync(password, usuario.password);

        if (!passwordValida)
        {
            return res.status(400).json({
                message: 'La contraseña no es correcta'
            });
        }

        // Genero el Token
        const token = await generarJWT(usuario.id);

        res.json({
            message: 'Login ok',
            usuario,
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