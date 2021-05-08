const AlbumSchema = require("../models/albumSchema");

const albumExists = async(album) =>
{
    const existeUsuario = await AlbumSchema.findOne({album});

    if (!existeUsuario)
    {
        throw new Error('El usuario no existe');
    }
}

module.exports =
{
    albumExists
}