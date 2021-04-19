const invalidTokens = require('../models/tokensNoValidos');

/**
 * Cuando el usuario elimine su cuenta o cierre sesión entra esta función para almacenar su token en una 
 * lista negra. Así impido que se pueda volver el token mientras aún esté activo
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
    const invalidToken = new invalidTokens({token});
    await invalidToken.save();
}

module.exports = deleteJWT;