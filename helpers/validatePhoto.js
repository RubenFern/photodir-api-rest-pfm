const AlbumSchema = require("../models/albumSchema");
const PhotoSchema = require("../models/photoSchema");

const albumExists = async(album) =>
{
    const existeUsuario = await AlbumSchema.findOne({album});

    if (!existeUsuario)
    {
        throw new Error('El usuario no existe');
    }
}

const photoExists = async(image) =>
{
    const photo = await PhotoSchema.findOne({ image });

    if (!photo)
    {
        throw new Error('La imagen no existe');
    }
}

module.exports =
{
    albumExists,
    photoExists
}