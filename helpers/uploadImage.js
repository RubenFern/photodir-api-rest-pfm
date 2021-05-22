const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const UserSchema = require("../models/userSchema");
const AlbumSchema = require("../models/albumSchema");
const PhotoSchema = require('../models/photoSchema');

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
        const { user_name } = user;
        
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

        const res = 
        {
            message: 'Imagen subida correctamente',
            nameImgUpload
        }

        resolve(res);
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
    const folderValid = ['avatar', 'album', 'photo'];

    if (folderValid.includes(folder.trim()))
    {
        return true;
    } else
    {
        return false;
    }
}

// Elimino la imagen anterior del usuario
const removeOldImage = async(folder, user, oldImage) =>
{
    let model = '';

    if (folder === 'avatar')
    {
        model = await UserSchema.findById(user._id);
    } else if (folder === 'album')
    {
        model = await AlbumSchema.findOne({uid_user: user._id, image: oldImage});
    } else if (folder === 'photo')
    {
        model = await PhotoSchema.findOne({image: oldImage});
    }

    // Si encontró la imagen significa que la ha editado, por lo que borro la anterior de mi API
    if (model)
    {
        const { image } = model;
        const pathOldImage = path.join(__dirname, '../uploads', user.user_name, folder, image);
        
        if (fs.existsSync(pathOldImage))
        {
            // La borro
            fs.unlinkSync(pathOldImage);
        }
    }
}

// Vacio el álbum en caso de borrarlo
const emptyAlbum = async(user, uid_album) =>
{
    const images = await PhotoSchema.find({uid_album});
    let pathImg = null;
    
    // Recorro todas las imágenes y las elimino
    for(let i in images) 
    {
        pathImg = path.join(__dirname, '../uploads', user.user_name, 'photo', images[i].image);

        if (fs.existsSync(pathImg))
        {
            fs.unlinkSync(pathImg);
        }
    }

    // Elimino también la imagen de la base de datos
    await PhotoSchema.deleteMany({uid_album}); 
}

module.exports =
{
    storeImage,
    validateFolder,
    removeOldImage,
    emptyAlbum
}