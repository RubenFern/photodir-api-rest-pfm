const {request, response} = require('express');

const UserSchema = require('../models/userSchema');

const searchUser = async(req = request, res = response) =>
{
    const { user_name } = req.params;

    const user = await UserSchema.find({user_name: new RegExp(`^${user_name}.*$`, 'i'), is_admin: false}).
                                  select('name user_name image creation_date private_profile -_id');
                            
    if (user.length === 0)
    {
        return res.json({
            message: 'El usuario no existe'
        })
    }

    res.json({
        user
    });
}

module.exports = 
{
    searchUser
}