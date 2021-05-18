const {request, response} = require('express');

const LikeSchema = require('../models/likeSchema');
const PhotoSchema = require('../models/photoSchema');

const viewLikes = async(req = request, res = response) =>
{
    const { image } = req.params;
    const { _id: uid_photo } = await PhotoSchema.findOne({image});

    const { likes } = await LikeSchema.findOne({uid_photo});

    if (!likes)
    {
        return res.json({
            message: 'No existe la imagen' 
        });
    }

    res.json({
        likes
    });
}

const addLike = async(req = request, res = response) =>
{
    // Recojo el nombre de la imagen para obtener el uid porque en la PhotoUserPage no recojo el uid de las imágenes. Y el número de like actual
    const { uid_photo } = req.params;

    // Incremento en 1 los likes de la fotografía
    const { _id: uid } = await LikeSchema.findOne({ uid_photo });
    const { likes } = await LikeSchema.findByIdAndUpdate(uid, { $inc: { 'likes': 1 } }, {new: true});

    res.json({
        message: 'Has dado like a la imagen',
        likes
    });
}

const removeLike = async(req = request, res = response) =>
{
    const { uid_photo } = req.params;

    // Decremento en 1 los likes de la fotografía
    const { _id: uid } = await LikeSchema.findOne({ uid_photo });
    const { likes } = await LikeSchema.findByIdAndUpdate(uid, { $inc: { 'likes': -1 } }, {new: true});

    res.json({
        message: 'Has quitado el like a la imagen',
        likes
    });
}

module.exports = 
{
    viewLikes,
    addLike,
    removeLike
}