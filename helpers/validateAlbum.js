const Album = require("../models/albumSchema");

const albumExists = async(uid_user, name) =>
{
    const existeAlbum = await Album.findOne({uid_user, name});
    
    if (existeAlbum)
    {
        return true;
    } else
    {
        return false;
    }
}

module.exports = albumExists;