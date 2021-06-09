const {Schema, model} = require('mongoose');

const ReportSchema = Schema
({
    // uid de la imagen reportada
    uid_image_reported:
    {
        type: Schema.Types.ObjectId,
        required: [true, 'Debes introducir el uid de la imagen reportada']
    },

    // nombre de la imagen reportada
    name_image_reported:
    {
        type: String,
        required: [true, 'Debes introducir la imagen a reportar']
    },

    // usuario que fue reportada
    user_reported:
    {
        type: String,
        required: [true, 'Debes especificar el usuario denunciado']
    },

    // usuario que reporta
    reporting_user:
    {
        type: String,
        required: [true, 'Debes especificar el usuario denunciante']
    },

    description:
    {
        type: String,
        required: [true, 'Debes indicar el motivo del reporte'],
        maxlength: 165
    },

    category:
    {
        type: String,
        enum: ['avatar', 'album', 'photo'],
        required: [true, 'Debes indicar la categoría']
    },

    state:
    {
        type: String,
        enum: ['approved', 'rejected', 'pending'], // aprobada, rechazada, pendiente
        required: [true, 'Debes indicar el estado'],
        default: 'pending'
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

// Impido que el JSON me devuelva la contraseña y la versión para tener solo los datos del usuario con los que trabajar
ReportSchema.methods.toJSON = function()
{
    const {__v, password, _id, ...report} = this.toObject();

    // Cambio el nombre de _id a uid
    report.uid = _id;

    return report;
}

// Exporto el nombre de la colección (Mongo añade una 's' al final) y el esquema de los atributos
module.exports = model('Report', ReportSchema);