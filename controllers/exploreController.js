const {request, response} = require('express');

const UserSchema = require('../models/userSchema');

const searchUser = async(req = request, res = response) =>
{
    const { user_name } = req.params;

    const user = await UserSchema.find({user_name: { $regex: `^${user_name}.*` }, is_admin: false}).
                                  select('name user_name image creation_date -_id');

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