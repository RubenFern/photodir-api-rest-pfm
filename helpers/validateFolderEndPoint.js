const validateFolderEndPoint = (folder) =>
{
    const folderValid = ['avatar', 'album', 'photo'];

    if (!folderValid.includes(folder.trim()))
    {
        throw new Error(`${folder} no es una directorio válido`);
    }

    return true;
}

module.exports =
{
    validateFolderEndPoint
}