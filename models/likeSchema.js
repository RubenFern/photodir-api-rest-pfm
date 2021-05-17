const {Schema, model} = require('mongoose');

const LikeSchema = Schema
({
    uid_photo: 
    {
        type: Schema.Types.ObjectId,
        ref: 'Photo',
        required: [true, 'Se necesita una imagen']
    },

    uid_user:
    {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Se debe asociar a un usuario']
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