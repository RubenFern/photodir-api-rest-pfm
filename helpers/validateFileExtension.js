
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

module.exports =
{
    validateFileExtension
}