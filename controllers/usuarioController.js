const {request, response} = require('express');
const { hashPassword } = require('../helpers/hashPassword');

const User = require('../models/usuarioSchema');
const deleteJWT = require("../helpers/eliminarJWT");

const viewUser = async(req = request, res = response) =>
{
    // Doy la posibilidad de añadir parámetros de búsqueda en la URL
    const {user_name} = req.params;

    /*const [usuarios, totalUsuarios] = await Promise.all([
        Usuario.find({is_admin: false}).skip(Number(from)).limit(Number(limit)),
        Usuario.countDocuments({is_admin: false})
    ]);*/

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
        user
    });
};

const editUser = async(req = request, res = response) =>
{
    // Guardo el uid del usuario conectado
    const {_id: uid} = req.user;
    // Desestructuro los campos que no quiero editar
    const {_id, password, email, user_name, ...data} = req.body;

    // Si introdujo una nueva contraseña la añado en el data
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
    // Guardo el uid del usuario conectado
    const {_id: uid} = req.user;

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