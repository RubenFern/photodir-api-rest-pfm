const TokensInvalid = require('../models/TokenInvalidSchema');

/**
 * Cuando el usuario elimine su cuenta o cierre sesión entra esta función para almacenar su token en una 
 * lista negra. Así impido que se pueda volver a usar el token mientras esté aún activo
*/
const deleteJWT = async(req, res) =>
{
    const token = req.header('ky-token');

    if (!token)
    {
        return res.status(401).json({
            message: 'No hay token en la petición'
        });
    }

    // Alamaceno el token en la lista negra
    const tokenInv = new TokensInvalid({token});
    await tokenInv.save();
}

module.exports = deleteJWT;