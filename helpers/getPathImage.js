const path = require('path');

const getPathImage = (folder, user_name, image) =>
{
    if (image !== 'default_image.jpg')
    {
        // Construyo la ruta de la imagen en mi API
        return path.join(__dirname, '../uploads', user_name, folder, image);

    } else
    {
        return path.join(__dirname, '../images', folder, image);
    }
}


module.exports =
{
    getPathImage
}