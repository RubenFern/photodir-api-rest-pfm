const { validateFileExtension } = require("./validateFileExtension");
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const uploadImage = (image, folder = '') =>
{
    // Subo la imagen mediante una promesa
    return new Promise( (resolve, reject) =>
    {
        // Empiezo la validación de la extensión del archivo
        if (!validateFileExtension(image))
        {
            return reject('El archivo no es válido. Debe ser una imagen');
        }
        
        // Cambio el nombre del archivo usando un identificador único
        const splitImage = image.name.split('.');
        const extension = splitImage[splitImage.length - 1];
        const nameImgUpload = `${uuidv4()}.${extension}`;
        
        const uploadPath = path.join(__dirname, '/../uploads/', folder, nameImgUpload); // Uno la ruta con el path de Node

        // Muevo la imagen subida a mi carpeta uploads
        image.mv(uploadPath, (error) =>
        {
            if (error)
            {
                return reject(error);
            }

            resolve('Imagen subida correctamente');
        });
    });
}

module.exports =
{
    uploadImage,
}