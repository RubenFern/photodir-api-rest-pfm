const { response, request } = require("express");
const { uploadImage } = require("../helpers/uploadImage");


const loadImage = async(req = request, res = response) =>
{
    // Si nos se han subido archivos retorno un error
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.image)
    {
        return res.status(400).json({
            message: 'No se han subido imágenes'
        });
    }

    const { image } = req.files;

    // Subo la imagen
    try 
    {
        const resp = await uploadImage(image); // Puedo añadir un segundo parámetro para el nombre de la carpeta

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
    loadImage,
}