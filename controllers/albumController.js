const {request, response} = require('express');
const path = require('path');
const fs = require('fs');

const { removeOldImage, emptyAlbum } = require('../helpers/uploadImage');
const userConnected = require('../helpers/userConnected');
const albumExists = require('../helpers/validateAlbum');

const Album = require('../models/albumSchema');
const User = require('../models/userSchema');

const viewAlbums = async(req = request, res = response) =>
{
    const {user_name} = req.params;

    const uid_user = await User.find({user_name});
    const albums = await Album.find({uid_user});

    res.json({
        user_name,
        success: true,
        albums
    });
}

const addAlbum = async(req = request, res = response) =>
{
    // Compruebo si el usuario está conectado
    userConnected(req, res);

    const {_id: uid_user, is_admin} = req.user_connected;

    if (is_admin)
    {
        return res.status(401).json({
            message: 'Los administradores no pueden crear álbumes'
        });
    }

    const {name, description, image} = req.body;

    // Compruebo que el usuario no tenga otro álbum igual
    if (await albumExists(uid_user, name))
    {
        return res.json({
            message: `Ya tienes creado un álbum con el nombre "${name}"`
        });
    }

    const album = new Album({uid_user, name, description, image});

    await album.save();

    res.json({
        message: 'Álbum creado',
        success: true,
        album
    });
}

const editAlbum = async(req = request, res = response) =>
{
    // Compruebo si el usuario está conectado
    userConnected(req, res);

    const {_id: uid_user} = req.user_connected;
    const {album_name} = req.params;
    
    // Recibo los datos que se quieren editar
    const {name: new_name, ...data} = req.body;

    // Compruebo que el álbum a editar exista
    if (!await albumExists(uid_user, album_name))
    {
        return res.json({
            message: 'El álbum no existe'
        });
    }

    // Si el álbum del usuario existe y no usa el mismo nombre que tenía devuelvo un error
    if (await albumExists(uid_user, new_name) && new_name !== album_name)
    {
        return res.status(401).json({
            message: 'Ya has usado este nombre para un álbum'
        });
    }

    // Si el álbum introducido es válido obtengo el id del álbum del usuario que quiere editar
    const {_id: uid_album} = await Album.findOne({name: album_name, uid_user});
    
    // Actualizo los datos del álbum
    const album = await Album.findByIdAndUpdate(uid_album, {name: new_name, ...data}, {new: true});

    res.json({
        message: 'Álbum editado',
        success: true,
        album
    });
}

const deleteAlbum = async(req = request, res = response) =>
{
    // Compruebo que el usuario esté conectado
    userConnected(req, res)

    const user = req.user_connected;
    const {_id: uid_user, user_name} = user;
    const {album_name} = req.params;
    const { image } = req.body;

    // Compruebo que el álbum a borrar exista
    if (!await albumExists(uid_user, album_name))
    {
        return res.json({
            message: 'El álbum no existe'
        });
    }

    // Elimino la imagen del álbum de la API
    if (image !== 'default_image.jpg')
    {
        removeOldImage('album', user, image);
    }

    const {_id: uid_album} = await Album.findOne({uid_user, name: album_name});

    // Elimino todas las fotograrías que tenía el álbum
    emptyAlbum(user_name, uid_album);

    // Elimino el álbum
    const album = await Album.findByIdAndDelete(uid_album);

    res.json({
        message: 'Elimino un álbum',
        success: true,
        album
    });
}

const deleteImage = async(req = request, res = response) =>
{
    // Compruebo si el usuario está conectado
    userConnected(req, res);

    const defaultImage = 'default_image.jpg';

    // Guardo el uid del usuario conectado
    const { album_name: name } = req.params;
    const { user_name } = req.user_connected;

    // Obtengo la imagen y el uid del álbum
    const { _id: uid, image } = await Album.findOne({ name });

    if (image === defaultImage)
    {
        return res.json({
            error: 'No puedes eliminar el avatar por defecto'
        });
    }

    const pathImage =  path.join(__dirname, '../uploads', user_name, 'album', image);

    // Elimino la imagen de la API
    if (fs.existsSync(pathImage))
    {
        fs.unlinkSync(pathImage);
    }

    // Establezco el avatar del usuario por defecto
    const album = await Album.findByIdAndUpdate(uid, { image: defaultImage }, { new: true });

    res.json({
        message: 'La imagen se ha eliminado',
        album
    });
}

module.exports = 
{
    viewAlbums,
    addAlbum,
    editAlbum,
    deleteAlbum,
    deleteImage
}