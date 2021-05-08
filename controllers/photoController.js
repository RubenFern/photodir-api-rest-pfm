const {request, response} = require('express');

const userConnected = require('../helpers/userConnected');
const albumExists = require('../helpers/validateAlbum');

const AlbumSchema = require('../models/albumSchema');
const PhotoSchema = require('../models/photoSchema');
const UserSchema = require('../models/userSchema');

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

const addPhoto = async(req = request, res = response) =>
{
    // Compruebo si el usuario está conectado
    userConnected(req, res);

    const {_id: uid_user, is_admin} = req.user_connected;

    if (is_admin)
    {
        return res.status(401).json({
            message: 'Los administradores no pueden tener álbumes'
        });
    }

    const { album } = req.params;

    // Compruebo que exista el álbum del usuario
    if (!await albumExists(uid_user, album))
    {
        return res.status(401).json({
            message: 'El álbum no existe'
        });
    }

    const {title, description, image} = req.body;
    
    const { _id: uid_album } = await AlbumSchema.findOne({name: album});

    const photo = new PhotoSchema({uid_album, title, description, image});

    await photo.save();

    res.status(201).json({
        message: 'Fotografía añadida',
        photo
    });
}

const editPhoto = async(req = request, res = response) =>
{

}

const deletePhoto = async(req = request, res = response) =>
{

}

module.exports =
{
    viewPhotos,
    addPhoto,
    editPhoto,
    deletePhoto
}