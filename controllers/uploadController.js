const { response, request } = require("express");
const fs = require('fs');

const { getPathImage } = require("../helpers/getPathImage");
const { storeImage, removeOldImage } = require("../helpers/uploadImage");
const UserSchema = require("../models/userSchema");

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

    // Compruebo si el perfil es privado 
    const { private_profile } = await UserSchema.findOne({ user_name });

    // Si es perfil es privado no muestro las imágenes
    if (private_profile)
    {
        return res.json({
            message: 'No tienes permisos para visualizar esta imagen'
        });
    }

    // Si la imagen no es la de por defecto uso la real del usuario
    const pathImage = getPathImage(folder, user_name, image);

    // Mediante FileSystem compruebo que exista la imagen
    if (fs.existsSync(pathImage))
    {
        return res.sendFile(pathImage);
    }
        
    res.json({
        message: 'No existe la imagen'
    });
}

// Ruta para las imágenes del home en caso de que el usuario conectado tenga el perfil privado
const getImageToken = async(req = request, res = response) =>
{
    const { folder, image } = req.params;
    const { user_name } = req.user_connected;
    
    const pathImage = getPathImage(folder, user_name, image);

    // Mediante FileSystem compruebo que exista la imagen
    if (fs.existsSync(pathImage))
    {
        return res.sendFile(pathImage);
    }
        
    res.json({
        message: 'No existe la imagen'
    });
}

const getAvatar = async(req = request, res = response) =>
{
    const { image, user_name } = req.params;

    const pathImage = getPathImage('avatar', user_name, image);
    

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
    getImage,
    getImageToken,
    getAvatar
}