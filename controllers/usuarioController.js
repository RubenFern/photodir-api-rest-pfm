const {request, response} = require('express');
const { hashPassword } = require('../helpers/hashPassword');

const User = require('../models/usuarioSchema');

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
    const {name, user_name, email, password} = req.body;
    const user = new User({name, user_name, email, password});

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
    const {user_name} = req.params;
    const {_id, password, email, ...data} = req.body;

    // Si introdujo una nueva contraseña la modifico
    if (password)
    {
        // Almaceno en el data la nueva contraseña hasheada
        hashPassword(data, password);
    }

    const {uid} = await User
    //const usuario = await User.findByIdAndUpdate(id, data);

    res.json({
        message: 'El usuario ha sido editado',
        //usuario
        uid
    });
};

const deleteUser = async(req = request, res = response) =>
{
    const {user_name} = req.params;

    // Guardo el usuario que se quiere borrar y el usuario que está conectado
    const user = await User.findById(id);
    const userConnect = req.usuario;

    // Compruebo que solo pueda eliminar usuarios el administrador y el propio usuario conectado a sí mismo
    if (userConnect.is_admin || JSON.stringify(user._id) == JSON.stringify(userConnect._id))
    {
        return res.json({
            message: 'El usuario se ha eliminado',
            user,
            userConnect
        });
    } else
    {
        return res.status(403).json({
            message: 'No tienes permisos para eliminar este usuario',
            user,
            userConnect
        });
    }    
};

module.exports = {
    viewUser,
    addUser,
    editUser,
    deleteUser
}