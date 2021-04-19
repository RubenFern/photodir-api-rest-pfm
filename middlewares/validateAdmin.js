const {request, response} = require('express');

const isAdmin = (req = request, res = response, next) =>
{
    if (!req.user)
    {
        // Establezco un error interno
        return res.status(500).json({
            message: 'Para validar si es admin se necesita el token de conexión'
        });
    }

    // Obtengo el usuario que está conectado
    const {is_admin} = req.user;

    if (!is_admin)
    {
        return res.status(403).json({
            message: 'No tienes permisos de administrador'
        });
    }

    next();
}

module.exports = isAdmin;