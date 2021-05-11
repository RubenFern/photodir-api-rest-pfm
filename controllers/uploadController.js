const { response, request } = require("express");
const path = require('path');
const fs = require('fs');

const { storeImage, removeOldImage } = require("../helpers/uploadImage");

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
    const oldImage = req.header('oldImage');
    const user = req.user_connected; // Al validar el Token obtengo el usuario
    const { folder } = req.params;

    // Elimino la imagen anterior en caso de tenerla
    await removeOldImage(folder, user, oldImage);

    // Subo la imagen
    try 
    {
        // Guardo la imagen en mi API y en la coleccion correspondiente del usuario que la suba
        const resp = await storeImage(image, user, folder);

        res.json({
            resp
        });
    } catch (err)
    {
        return res.json({
            message: err
        });
    }    
}

const getImage = async(req = request, res = response) =>
{
    const { folder, image, user_name } = req.params;
        
    let pathImage;

    // Si la imagen no es la de por defecto uso la real del usuario
    if (image !== 'default_image.jpg')
    {
        // Construyo la ruta de la imagen en mi API
        pathImage = path.join(__dirname, '../uploads', user_name, folder, image);

    } else
    {
        pathImage = path.join(__dirname, '../images', folder, image);
    }

    // Mediante FileSystem compruebo que exista la imagen
    if (fs.existsSync(pathImage))
    {
        return res.sendFile(pathImage);
    }
        
    res.json({
        message: 'No existe la imagen'
    });
}

module.exports =
{
    uploadImage,
    getImage
}