const {request, response} = require('express');

const AlbumSchema = require('../models/albumSchema');
const LikeSchema = require('../models/likeSchema');
const PhotoSchema = require('../models/photoSchema');
const UserSchema = require('../models/userSchema');

const getLikes = async(req = request, res = response) =>
{
    const { image } = req.params;
    const { _id: uid_photo } = await PhotoSchema.findOne({image}); 

    // Cuento el número de registro de esa imagen, sino no existe en la colección devuelve 0 Likes
    const likes = await LikeSchema.countDocuments({uid_photo});
    
    res.json({
        likes
    });
}

const getImageLiked = async(req = request, res = response) =>
{
    const { username: user_name } = req.params;
    const { _id: uid_user_liked } = await UserSchema.findOne({ user_name });
    let photos = [];

    const liked = await LikeSchema.find({ uid_user_liked });

    for(let i in liked) 
    {
        // Obtengo la información del usuario
        const res = await PhotoSchema.findById(liked[i].uid_photo);
        const { _id: uid, uid_album, title, description, image, creation_date } = res;

        // Obtengo el nombre de usuario dueño de la fotografía
        const { user_name } = await UserSchema.findById(liked[i].uid_owner_image);
        const { name: album_name } = await AlbumSchema.findById(uid_album);

        const obj = { uid, album_name, title, description, image, creation_date, user_name };

        photos.push(obj);
    }

    res.json({
        photos
    });
}

const addLike = async(req = request, res = response) =>
{
    // Obtengo el nombre de la imagen
    const { user_name, image } = req.body;

    // Obtengo el uid del usuario dueño de la imagen
    const uid_owner_image = await UserSchema.findOne({ user_name });

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
    const like = new LikeSchema({ uid_photo, uid_album, uid_user_liked, uid_owner_image });
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
    getImageLiked,
    addLike,
    removeLike,
    checkLike
}