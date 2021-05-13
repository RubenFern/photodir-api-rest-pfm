const {request, response} = require('express');
const { removeOldImage } = require('../helpers/uploadImage');

const userConnected = require('../helpers/userConnected');
const albumExists = require('../helpers/validateAlbum');
const Album = require('../models/albumSchema');
const User = require('../models/userSchema');

const viewAlbums = async(req = request, res = response) =>
{
    const {user_name} = req.params;

    const uid_user = await User.find({user_name});
    const albums = await Album.find({uid_user});
    /*const albums = await Album.aggregate([{
        $lookup: {from: 'users', localField: 'uid_user', foreignField: '_id', as: user_name}
    }]);*/

    res.json({
        user_name,
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
        return res.status(401).json({
            message: `Ya tienes creado el álbum de ${name}`
        });
    }

    const album = new Album({uid_user, name, description, image});

    await album.save();

    res.status(201).json({
        message: 'Álbum creado',
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
        return res.status(401).json({
            message: 'El álbum no existe'
        });
    }

    // Compruebo que el nuevo nombre no sea igual a otro álbum ya creado
    /*if (await albumExists(uid_user, new_name))
    {
        return res.status(401).json({
            message: 'Ya has usado este nombre para un álbum'
        });
    }*/ // No lo compruebo porque el usuario podría editar la descripción pero el nombre no

    // Si el álbum introducido es válido obtengo el id del álbum del usuario que quiere editar
    const {_id: uid_album} = await Album.findOne({name: album_name, uid_user});
    
    // Actualizo los datos del álbum
    const album = await Album.findByIdAndUpdate(uid_album, {name: new_name, ...data}, {new: true});

    res.json({
        message: 'Álbum editado',
        album
    });
}

const deleteAlbum = async(req = request, res = response) =>
{
    // Compruebo que el usuario esté conectado
    userConnected(req, res)

    const user = req.user_connected;
    const {_id: uid_user} = user;
    const {album_name} = req.params;
    const { image } = req.body;

    // Compruebo que el álbum a borrar exista
    if (!await albumExists(uid_user, album_name))
    {
        return res.status(401).json({
            message: 'El álbum no existe'
        });
    }

    // Elimino la imagen del álbum de la API
    if (image !== 'default_image.jpg')
    {
        removeOldImage('album', user, image);
    }

    // Elimino el álbum
    const {_id: uid_album} = await Album.findOne({uid_user, name: album_name});
    const album = await Album.findByIdAndDelete(uid_album);

    res.json({
        message: 'Elimino un álbum',
        album
    });
}

module.exports = 
{
    viewAlbums,
    addAlbum,
    editAlbum,
    deleteAlbum
}