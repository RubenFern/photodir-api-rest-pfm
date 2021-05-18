const {request, response} = require('express');

const UserSchema = require('../models/userSchema');
const AlbumSchema = require('../models/albumSchema');


const viewUsers = async(req = request, res = response) =>
{
    const user = await UserSchema.find();
    let users = [];

    // Añado el número de álbumes 
    for(let i in user) 
    {
        const numAlbums = await AlbumSchema.where({uid_user: user[i]._id}).countDocuments();

        // Retorno el número de álbumes del usuario
        user[i].albums = numAlbums;
        
        users.push({user: user[i], numAlbums});
    }

    res.json({
        users
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

module.exports = {  
    viewUsers,
    setRoleAdmin
}