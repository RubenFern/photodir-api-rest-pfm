const {request, response} = require('express');

const User = require('../models/userSchema');

const deleteJWT = require("../helpers/deleteJWT");
const { hashPassword } = require('../helpers/hashPassword');
const userConnected = require('../helpers/userConnected');
const generateJWT = require('../helpers/generateJWT');

const viewUser = async(req = request, res = response) =>
{
    // Recojo el usuario por la URL
    const {user_name} = req.params;

    const user = await User.find({user_name: user_name});

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
    // Desestructuro los campos que no quiero editar
    const {_id, password, email, user_name, ...data} = req.body;

    // Si introdujo una nueva contraseña la hasheo y la añado en el data
    if (password)
    {
        hashPassword(data, password);
    }

    const user = await User.findByIdAndUpdate(uid, data);

    res.json({
        message: 'El usuario ha sido editado',
        user,
        uid
    });
};

const deleteUser = async(req = request, res = response) =>
{
    // Compruebo si el usuario está conectado
    userConnected(req, res);

    // Guardo el uid del usuario conectado
    const {_id: uid} = req.user_connected;

    const userDelete = await User.findByIdAndDelete(uid);

    // Añado el token en la lista negra
    deleteJWT(req, res);

    res.json({
        message: 'El usuario se ha eliminado',
        uid,
        userDelete
    }); 
};

module.exports = {
    viewUser,
    addUser,
    editUser,
    deleteUser
}