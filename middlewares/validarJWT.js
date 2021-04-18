const {request, response} = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('./../models/usuario');

const validarJWT = async(req = request, res = response, next) =>
{
    const token = req.header('ky-token');

    if (!token)
    {
        return res.status(401).json({
            message: 'No hay token en la petición'
        });
    }

    try 
    {
        // Obtengo el uid del usuario logueado
        const {uid} = jwt.verify(token, process.env.PRIVATEKEYTOKEN);

        // Leo el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);
        
        // Guardo el usuario que está conectado en el request
        req.usuario = usuario;
        next();

    } catch (err)
    {
        console.log(err);
        res.status(401).json({
            message: 'Token no válido'
        });
    }
}

module.exports = validarJWT;