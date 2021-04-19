const {request, response} = require('express');
const jwt = require('jsonwebtoken');
const TokensInvalid = require('../models/TokenInvalidSchema');

const User = require('../models/userSchema');

const validateJWT = async(req = request, res = response, next) =>
{
    const token = req.header('ky-token');

    if (!token)
    {
        return res.status(401).json({
            message: 'No hay token en la petición'
        });
    }

    // Compruebo que no esté en la lista negra
    const tokenInvalid = await TokensInvalid.findOne({token});

    if (tokenInvalid)
    {
        return res.status(401).json({
            message: 'El token no es válido'
        });
    }

    try 
    {
        // Obtengo el uid del usuario logueado
        const {uid} = jwt.verify(token, process.env.PRIVATEKEYTOKEN);

        // Leo el usuario que corresponde al uid
        const user = await User.findById(uid);
        
        // Guardo el usuario que está conectado en el request
        req.user_connected = user;
        next();

    } catch (err)
    {
        console.log(err);
        res.status(401).json({
            message: 'Token no válido'
        });
    }
}

module.exports = validateJWT;