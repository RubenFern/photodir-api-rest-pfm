const {request, response} = require('express');
const path = require('path');
const fs = require('fs');

const User = require('../models/userSchema');
const LikeSchema = require('../models/likeSchema');
const AlbumSchema = require('../models/albumSchema');
const PhotoSchema = require('../models/photoSchema');

const deleteJWT = require("../helpers/deleteJWT");
const { hashPassword } = require('../helpers/hashPassword');
const userConnected = require('../helpers/userConnected');

const viewUser = async(req = request, res = response) =>
{
    // Recojo el usuario por la URL
    const {user_name} = req.params;

    const user = await User.findOne({user_name}).select('name user_name image creation_date private_profile -_id');

    res.json({
        user
    });
};

const addUser = async(req = request, res = response) =>
{
    // Desestructuro los parámetros que quiero y los devuelvo en la instancia del modelo
    const {name, user_name, email, password, is_admin} = req.body;
    const user = new User({name, user_name, email, password, is_admin});

    // Encripto la contraseña
    hashPassword(user, password);
    
    // Guardo el usuario en la colección
    await user.save(); 

    res.json({
        message: 'El usuario ha sido creado',
        user,
        logged: true
    });
};

const editUser = async(req = request, res = response) =>
{
    // Compruebo si el usuario está conectado
    userConnected(req, res);

    // Guardo el uid del usuario conectado
    const {_id: uid} = req.user_connected;
    // Desestructuro los campos que no quiero editar para guardar los que sí y la contraseña para su cifrado
    const {_id, password, email, user_name, is_admin, ...data} = req.body;
console.log(data)
    // Si introdujo una nueva contraseña la hasheo y la añado en el data
    if (password)
    {
        // Añado la contraseña al data que contiene los campos a editar
        hashPassword(data, password);
    }

    // Si no existen datos que editar cancelo el proceso
    if (!Object.keys(data).length)
    {
        return res.json({
            message: 'No ha editado ningún dato'
        })
    }

    const user = await User.findByIdAndUpdate(uid, data, { new: true });

    res.json({
        message: 'El usuario ha sido editado',
        user
    });
};

const deleteUser = async(req = request, res = response) =>
{
    // Compruebo si el usuario está conectado
    userConnected(req, res);

    // Guardo el uid del usuario conectado
    const {_id: uid, user_name} = req.user_connected;
    
    // Elimino todos los álbumes y las fotografías del usuario
    emptyDataUser(uid, user_name);

    const userDelete = await User.findByIdAndDelete(uid);

    // Añado el token en la lista negra
    deleteJWT(req, res);

    res.json({
        message: 'El usuario se ha eliminado',
        uid,
        userDelete
    }); 
};

const emptyDataUser = async(uid, user_name) =>
{
    // Borro la carpeta raíz del usuario y ya borra todo su contenido
    const pathData = path.join(__dirname, '../uploads', user_name);

    if (fs.existsSync(pathData))
    {
        // Con la opción recursive true hago un borrado de todo el contenido
        fs.rmdirSync(pathData, { recursive: true });
    }

    // Recorro todos los álbumes para borrar sus fotografías
    const albums = await AlbumSchema.find({ uid_user: uid });

    for(let i in albums) 
    {
        await PhotoSchema.deleteMany({ uid_album: albums[i]._id });
    }

    // Elimino los datos de la base de datos de album y likes
    await LikeSchema.deleteMany({ uid_user_liked: uid });
    await AlbumSchema.deleteMany({ uid_user: uid });
}

module.exports = 
{
    viewUser,
    addUser,
    editUser,
    deleteUser
}