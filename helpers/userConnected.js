/**
 * Compruebo que exista un usuario conectado, si no lo hay significa que no validó el token.
 * 
 * Devuelvo un error del servidor
*/
const userConnected = (req, res) =>
{
    if (!req.user_connected)
    {
        // Establezco un error interno
        return res.status(500).json({
            message: 'No hay ningún usuario conectado. Se debe validar antes el token'
        });
    }
}

module.exports = userConnected;