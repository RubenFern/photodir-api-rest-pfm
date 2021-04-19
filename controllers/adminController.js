const {request, response} = require('express');

const User = require('../models/userSchema');

const viewUsers = async(req = request, res = response) =>
{
    const users = await User.find();

    res.json({
        users
    });
}

module.exports = {  
    viewUsers
}