const { response, request } = require("express");
const { storeImage } = require("../helpers/uploadImage");


const uploadImage = async(req = request, res = response) =>
{
    // Si nos se han subido archivos retorno un error
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.image)
    {
        return res.status(400).json({
            message: 'No se han subido imágenes'
        });
    }

    const { image } = req.files;
    const user = req.user_connected; // Al validar el Token obtengo el usuario
    const { folder } = req.params;

    // Subo la imagen
    try 
    {
        // Guardo la imagen en mi API y en la coleccion correspondiente del usuario que la suba
        const resp = await storeImage(image, user, folder);

        res.json({
            message: resp
        });
    } catch (err)
    {
        return res.json({
            message: err
        });
    }    
}

module.exports =
{
    uploadImage
}