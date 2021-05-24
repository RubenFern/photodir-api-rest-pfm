const {Schema, model} = require('mongoose');

const AlbumSchema = Schema
({
    uid_user: 
    {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El álbum debe pertenecer a un usuario']
    },

    name:
    {
        type: String,
        required: [true, 'El nombre del álbum es obligatorio']
    },

    description: 
    {
        type: String,
        maxlength: 205
    },

    image:
    {
        type: String,
        default: 'default_image.jpg'
    },

    creation_date:
    {
        type: String,
        default: () =>
        {
            const date = new Date();

            return date.toLocaleString();
        }
    }
});

AlbumSchema.methods.toJSON = function()
{
    const {__v, _id, ...album} = this.toObject();

    // Cambio el nombre de _id a uid
    album.uid = _id;

    return album;
}

module.exports = model('Album', AlbumSchema);