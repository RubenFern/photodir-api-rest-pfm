const {request, response} = require('express');
const userConnected = require('../helpers/userConnected');

const isAdmin = (req = request, res = response, next) =>
{
    // Compruebo si el usuario está conectado
    userConnected(req, res);

    // Obtengo el usuario que está conectado
    const {is_admin} = req.user_connected;

    if (!is_admin)
    {
        return res.status(403).json({
            message: 'No tienes permisos de administrador'
        });
    }

    next();
}

module.exports = isAdmin;