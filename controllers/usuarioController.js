const {request, response} = require('express');
const { hashPassword } = require('../helpers/hashPassword');

const Usuario = require('./../models/usuario');

const viewUsers = async(req = request, res = response) =>
{
    // Doy la posibilidad de añadir parámetros de búsqueda en la URL
    const {from, limit} = req.query;

    const [usuarios, totalUsuarios] = await Promise.all([
        Usuario.find({is_admin: false}).skip(Number(from)).limit(Number(limit)),
        Usuario.countDocuments({is_admin: false})
    ]);

    res.json({
        totalUsuarios,
        usuarios
    });
};

const addUser = async(req = request, res = response) =>
{
    // Desestructuro los parámetros que quiero y los devuelvo en la instancia del modelo
    const {name, email, password, is_admin} = req.body;
    const usuario = new Usuario({name, email, password, is_admin});

    // Encripto la contraseña
    hashPassword(usuario, password);
    
    // Guardo el usuario en la colección
    await usuario.save(); 

    res.json({
        message: 'El usuario ha sido creado',
        usuario
    });
};

const editUser = async(req = request, res = response) =>
{
    const {id} = req.params;
    const {_id, password, email, ...data} = req.body;

    // Si introdujo una nueva contraseña la modifico
    if (password)
    {
        // Almaceno en el data la nueva contraseña hasheada
        hashPassword(data, password);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, data);

    res.json({
        message: 'El usuario ha sido editado',
        usuario
    });
};

const deleteUser = async(req = request, res = response) =>
{
    const {id} = req.params;

    // Guardo el usuario que se quiere borrar y el usuario que está conectado
    const usuario = await Usuario.findById(id);
    const usuarioConectado = req.usuario;

    // Compruebo que solo pueda eliminar usuarios el administrador y el propio usuario conectado a sí mismo
    if (usuarioConectado.is_admin || JSON.stringify(usuario._id) == JSON.stringify(usuarioConectado._id))
    {
        return res.json({
            message: 'El usuario se ha eliminado',
            usuario,
            usuarioConectado
        });
    } else
    {
        return res.status(403).json({
            message: 'No tienes permisos para eliminar este usuario',
            usuario,
            usuarioConectado
        });
    }    
};

module.exports = {
    viewUsers,
    addUser,
    editUser,
    deleteUser
}