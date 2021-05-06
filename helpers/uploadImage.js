const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Colecciones
const UserSchema = require('../models/userSchema');
const AlbumSchema = require('../models/albumSchema');

const storeImage = (image, user = '', folder = '') =>
{
    // Subo la imagen mediante una promesa
    return new Promise( (resolve, reject) =>
    {
        // Empiezo la validación de la extensión del archivo
        if (!validateFileExtension(image))
        {
            return reject('El archivo no es válido. Debe ser una imagen');
        }

        // Valido la ubicación
        if (!validateFolder(folder))
        {
            return reject(`La ubicación ${folder} no es válida - Las imágenes son de [avatar, album, post]`);
        }

        // Con todo válido guardo el usuario para almacenar la imagen en su carpeta y en su base de datos
        const { _id: uid, user_name } = user;
        
        // Cambio el nombre del archivo usando un identificador único
        const splitImage = image.name.split('.');
        const extension = splitImage[splitImage.length - 1];
        const nameImgUpload = `${uuidv4()}.${extension}`;
        
        // Uno la ruta usando el path de Node
        const uploadPath = path.join(__dirname, '/../uploads/', user_name, folder, nameImgUpload); 

        // Muevo la imagen subida a mi carpeta uploads
        image.mv(uploadPath, (error) =>
        {
            if (error)
            {
                return reject(error);
            }
        });

        // Guardo la imagen en la colección correspondiente del usuario
        saveImageInBD(uid, folder, nameImgUpload);

        resolve('Imagen subida correctamente');
    });
}

const validateFileExtension = (image) =>
{
    // Valido con el tipo Mime que genera express-upload
    const validExtensions = ['image/png', 'image/gif', 'image/svg', 'image/jpeg'];

    if (!validExtensions.includes(image.mimetype))
    {
        return false;
    } else
    {
        return true
    }
}

// Valido la carpeta donde se va a subir la imagen. Hago la validación en la ruta
const validateFolder = (folder) =>
{
    const folderValid = ['avatar', 'album', 'post'];

    if (folderValid.includes(folder.trim()))
    {
        return true;
    } else
    {
        return false;
    }
}

// Función para almacenar en la BD la imagen subida del usuario
const saveImageInBD = async(uidUser, folder, image) =>
{
    switch (folder) {
        case 'avatar':
            await UserSchema.findByIdAndUpdate(uidUser, image);

            break;
        case 'album':
            await AlbumSchema.findOneAndUpdate({uid_user: uidUser}, image);

            break;
        case 'post':
            console.log('imagen guardada en la bd de imagenes')

            break;
        default:
            break;
    }
}

module.exports =
{
    storeImage,
    validateFolder
}