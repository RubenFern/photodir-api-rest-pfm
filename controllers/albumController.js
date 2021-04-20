const {request, response} = require('express');

const userConnected = require('../helpers/userConnected');
const Album = require('../models/albumSchema');

const viewAlbums = async(req = request, res = response) =>
{
    const {user_name} = req.params;

}

const addAlbum = async(req = request, res = response) =>
{
    // Compruebo si el usuario está conectado
    userConnected(req, res);

    const {_id: uid_user} = req.user_connected;
    const {name, description, image} = req.body;

    const album = new Album({uid_user, name, description, image});

    await album.save();

    res.json({
        message: 'Álbum creado',
        album
    });
}

const editAlbum = (req = request, res = response) =>
{
    res.json({
        message: 'Edito un álbum'
    });
}

const deleteAlbum = (req = request, res = response) =>
{
    res.json({
        message: 'Elimino un álbum'
    });
}

module.exports = 
{
    viewAlbums,
    addAlbum,
    editAlbum,
    deleteAlbum
}