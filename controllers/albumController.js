const {request, response} = require('express');

const userConnected = require('../helpers/userConnected');
const albumExists = require('../helpers/validateAlbum');
const Album = require('../models/albumSchema');

const viewAlbums = async(req = request, res = response) =>
{
    const {user_name} = req.params;

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
        return res.status(401).json({
            message: 'Ya tienes creado un álbum con el mismo nombre'
        });
    }

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