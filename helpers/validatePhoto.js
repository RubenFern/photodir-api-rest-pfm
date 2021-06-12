const AlbumSchema = require("../models/albumSchema");
const PhotoSchema = require("../models/photoSchema");

const albumExists = async(album) =>
{
    const res = await AlbumSchema.findOne({name: album});

    if (!res)
    {
        throw new Error('El álbum no existe');
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