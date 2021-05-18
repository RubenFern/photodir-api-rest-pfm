const {Schema, model} = require('mongoose');

const LikeSchema = Schema
({
    uid_photo: 
    {
        type: Schema.Types.ObjectId,
        ref: 'Photo',
        required: [true, 'Se necesita una imagen']
    },

    // Me permitirá contar los likes totales de los álbumes
    uid_album:
    {
        type: Schema.Types.ObjectId,
        ref: 'Album',
        required: [true, 'Se debe asociar a un álbum']
    },

    likes:
    {
        type: Number,
        default: 0
    },
});

LikeSchema.methods.toJSON = function()
{
    const {__v, _id, ...like} = this.toObject();

    // Cambio el nombre de _id a uid
    like.uid = _id;

    return like;
}

module.exports = model('Like', LikeSchema);