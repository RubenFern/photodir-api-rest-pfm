const {request, response} = require('express');
const path = require('path');
const fs = require('fs');

const UserSchema = require('../models/userSchema');
const AlbumSchema = require('../models/albumSchema');
const PhotoSchema = require('../models/photoSchema');
const LikeSchema = require('../models/likeSchema');

const { getPathImage } = require('../helpers/getPathImage');

const viewUsers = async(req = request, res = response) =>
{
    const users = await UserSchema.find();

    res.json({
        users
    });
}

const deleteUser = async(req = request, res = response) =>
{
    const { user_name } = req.body;

    // Borro la carpeta raíz del usuario y ya borra todo su contenido
    const pathData = path.join(__dirname, '../uploads', user_name);

    if (fs.existsSync(pathData))
    {
        // Con la opción recursive true hago un borrado de todo el contenido
        fs.rmdirSync(pathData, { recursive: true });
    }

    const { _id: uid } = await UserSchema.findOne({ user_name });

    // Recorro todos los álbumes para borrar sus fotografías
    const albums = await AlbumSchema.find({ uid_user: uid });

    if (albums)
    {
        for(let i in albums) 
        {
            await PhotoSchema.deleteMany({ uid_album: albums[i]._id });
        }

        // Elimino los datos de la base de datos de album y likes
        await AlbumSchema.deleteMany({ uid_user: uid });
    }

    await UserSchema.findByIdAndDelete(uid);
    await LikeSchema.deleteMany({ uid_user_liked: uid });

    res.json({
        message: `El usuario ${user_name} ha sido eliminado`
    });
}

// Controlador para dar o quitar el rol de administrador. Sólo lo puede usar el admin
const setRoleAdmin = async(req = request, res = response) =>
{
    const { user_name } = req.body;

    if (user_name === 'admin')
    {
        return res.json({
            message: 'No puedes modificar este usuario'
        });
    }

    let message = '';

    const { is_admin, _id: uid } = await UserSchema.findOne({ user_name });
    const user = await UserSchema.findByIdAndUpdate(uid, {is_admin: !is_admin}, { new: true });

    if (is_admin)
    {
        message = `${user_name} ya no es administrador`;
    } else
    {
        message = `${user_name} ahora es administrador`;
    }

    res.json({
        message,
        user
    });
}

// Devuelvo las imágenes de cualquier usuario tenga el perfil público o privado
const getImageFromUser = async(req = request, res = response) =>
{
    const { user_name, category, image } = req.params;

    const pathImage = getPathImage(category, user_name, image);
    
    if (fs.existsSync(pathImage))
    {
        return res.sendFile(pathImage);
    }
        
    res.json({
        message: 'No existe la imagen'
    });
}

module.exports = {  
    viewUsers,
    setRoleAdmin,
    getImageFromUser,
    deleteUser
}