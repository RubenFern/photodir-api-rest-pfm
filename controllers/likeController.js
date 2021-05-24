const {request, response} = require('express');

const LikeSchema = require('../models/likeSchema');
const PhotoSchema = require('../models/photoSchema');

const getLikes = async(req = request, res = response) =>
{
    const { image } = req.params;
    const { _id: uid_photo }   = await PhotoSchema.findOne({image}); 

    // Cuento el número de registro de esa imagen, sino no existe en la colección devuelve 0 Likes
    const likes = await LikeSchema.countDocuments({uid_photo});
    
    res.json({
        likes
    });
}

const addLike = async(req = request, res = response) =>
{
    // Obtengo el nombre de la imagen
    const { image } = req.body;

    // Obtengo los uid del álbum, photo y usuario
    const {_id: uid_user_liked } = req.user_connected;
    const { _id: uid_photo, uid_album } = await PhotoSchema.findOne({ image });

    // Compruebo que el usuario no haya dado Like antes a la misma photo
    const existLike = await LikeSchema.findOne({ uid_user_liked, uid_photo });

    if(existLike)
    {
        return res.json({
            message: 'Ya has dado Like'
        });
    }

    // Añado en la colección de likes la misma imagen y el usuario que dió Like
    const like = new LikeSchema({ uid_photo, uid_album, uid_user_liked });
    await like.save();

    res.json({
        message: 'Has dado like a la imagen'
    });
}

const removeLike = async(req = request, res = response) =>
{
    const { image } = req.body;

    // Obtengo el uid de la photo y del usuario
    const { _id: uid_photo } = await PhotoSchema.findOne({ image });
    const {_id: uid_user_liked } = req.user_connected;
    
    // Elimino el Like de la colección
    await LikeSchema.findOneAndDelete({ uid_photo, uid_user_liked });

    res.json({
        message: 'Has quitado el like a la imagen'
    });
}

const checkLike = async(req = request, res = response) =>
{
    const { image } = req.body;

    const { _id: uid_photo } = await PhotoSchema.findOne({ image });
    const {_id: uid_user_liked } = req.user_connected;

    // Si existe en la colección significa que el usuario le dió like
    const likeExists = await LikeSchema.findOne({ uid_photo, uid_user_liked });

    if (!likeExists)
    {
        return res.json({
            likeExists: false
        });
    }

    res.json({
        likeExists: true
    });
}

module.exports = 
{
    getLikes,
    addLike,
    removeLike,
    checkLike
}