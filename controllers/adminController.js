const {request, response} = require('express');
const fs = require('fs');

const UserSchema = require('../models/userSchema');

const { getPathImage } = require('../helpers/getPathImage');


const viewUsers = async(req = request, res = response) =>
{
    const user = await UserSchema.find();

    res.json({
        user
    });
}

// Controlador para dar o quitar el rol de administrador. Sólo lo puede usar el admin
const setRoleAdmin = async(req = request, res = response) =>
{
    const { user_name } = req.body;
    let message = '';

    const { is_admin, _id: uid } = await UserSchema.findOne({ user_name });
    await UserSchema.findByIdAndUpdate(uid, {is_admin: !is_admin});

    if (is_admin)
    {
        message = `${user_name} ya no es administrador`;
    } else
    {
        message = `${user_name} ahora es administrador`;
    }

    res.json({
        message
    });
}

// Devuelvo las imágenes de cualquier usuario tenga el perfil público o privado
const getImageFromUser = async(req = request, res = response) =>
{
    const { user_name, category, image } = req.params;

    const pathImage = getPathImage(category, user_name, image);
    
    if (fs.existsSync(pathImage))
    {
        return res.sendFile(pathImage);
    }
        
    res.json({
        message: 'No existe la imagen'
    });
}

module.exports = {  
    viewUsers,
    setRoleAdmin,
    getImageFromUser
}