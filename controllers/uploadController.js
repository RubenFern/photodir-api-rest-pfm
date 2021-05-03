const { response } = require("express");
const path = require('path');

const uploadImage = (req, res = response) =>
{
    // Si nos se han subido archivos retorno un error
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.image)
    {
        return res.status(400).json({
            message: 'No se han subido imágenes'
        });
    }

    const { image } = req.files;
    const uploadPath = path.join(__dirname, '../uploads/', image.name); // Uno la ruta con el path de Node

    // Muevo la imagen subida a mi carpeta uploads
    image.mv(uploadPath, (error) =>
    {
        if (error)
        {
            return res.status(500).json({json});
        }

        res.json({
            message: 'Imagen subida correctamente'
        });
    });
}


module.exports =
{
    uploadImage,
}