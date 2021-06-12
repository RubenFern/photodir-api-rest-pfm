const {request, response} = require('express');
const path = require('path');
const fs = require('fs');

const UserSchema = require('../models/userSchema');
const AlbumSchema = require('../models/albumSchema');
const PhotoSchema = require('../models/photoSchema');
const LikeSchema = require('../models/likeSchema');

const { getPathImage } = require('../helpers/getPathImage');
const albumExists = require('../helpers/validateAlbum');
const { emptyAlbum } = require('../helpers/uploadImage');

const viewUsers = async(req = request, res = response) =>
{
    const users = await UserSchema.find();

    res.json({
        users
    });
}

const viewUser = async(req = request, res = response) =>
{
    const { user_name } = req.params;

    const user = await UserSchema.findOne({user_name});

    res.json({
        user
    });
}

const viewAlbums = async(req = request, res = response) =>
{
    const { user_name } = req.params;

    const uid_user = await UserSchema.find({user_name});
    const albums = await AlbumSchema.find({uid_user});

    res.json({
        user_name,
        success: true,
        albums
    });
}

const viewPhotos = async(req = request, res = response) =>
{
    const { user_name, album } = req.params;
    const { _id: uid_user } = await UserSchema.findOne({user_name});

    // Compruebo que exista el álbum del usuario
    if (!await albumExists(uid_user, album))
    {
        return res.status(401).json({
            message: 'El álbum no existe'
        });
    }

    const { _id: uid_album } = await AlbumSchema.findOne({uid_user, name: album});
    const photos = await PhotoSchema.find({uid_album});

    res.json({
        photos
    });
}

const deleteUser = async(req = request, res = response) =>
{
    const { user_name } = req.body;

    if (user_name === 'admin')
    {
        return res.status(401).json({
            message: 'Este usuario no se puede borrar'
        });
    }

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

const deleteAlbum = async(req = request, res = response) =>
{
    const { album } = req.params;
    const { user_name, image } = req.body;

    // Obtengo el usuario y uso la función para eliminar todas las imágenes del álbum
    const user = await UserSchema.findOne({ user_name });

    const { _id: uid_user } = user;

    // Compruebo que el álbum sea del usuario
    if (!await albumExists(uid_user, album))
    {
        return res.json({
            message: 'El álbum no existe'
        });
    }

    // Elimino la imagen del álbum si no es la de por defecto
    if (image !== 'default_image.jpg')
    {
        const pathImage = path.join(__dirname, '../uploads', user_name, 'album', image);

        if (fs.existsSync(pathImage))
        {
            fs.unlinkSync(pathImage);
        }
    }

    const {_id: uid_album} = await AlbumSchema.findOne({uid_user, name: album});

    // Elimino todas las fotograrías que tenía el álbum
    emptyAlbum(user_name, uid_album);

    // Elimino el álbum
    const albumRemove = await AlbumSchema.findByIdAndDelete(uid_album);

    res.json({
        message: 'El álbum se ha eliminado',
        success: true,
        albumRemove
    });   
}

const deletePhoto = async(req = request, res = response) =>
{
    const { image } = req.params;
    const { user_name, album } = req.body;

    // Compruebo que el álbum contenga dicha imagen
    const { _id: uid } = await AlbumSchema.findOne({ name: album });
    const imageExists = await PhotoSchema.findOne({ uid_album: uid, image });

    if (!imageExists)
    {
        return res.json({
            message: 'La imagen no existe'
        });
    }

    const pathImage = path.join(__dirname, '../uploads', user_name, 'photo', image);

    // Borro la imagen de la API
    if (fs.existsSync(pathImage))
    {
        fs.unlinkSync(pathImage);
    }

    const { _id: uid_photo } = imageExists;

    // ELimino la foto de la base de datos
    const photo = await PhotoSchema.findByIdAndDelete(uid_photo);

    // Elimino la fotografía de la colección de likes
    await LikeSchema.findOneAndDelete({uid_photo});

    res.json({
        message: 'Fotografía eliminada',
        photo
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
    viewUser,
    viewAlbums,
    viewPhotos,
    setRoleAdmin,
    getImageFromUser,
    deleteUser,
    deleteAlbum,
    deletePhoto
}