const { response, request } = require("express");
const path = require('path');
const fs = require('fs');

const AlbumSchema = require("../models/albumSchema");
const PhotoSchema = require("../models/photoSchema");
const ReportSchema = require("../models/ReportSchema");
const UserSchema = require("../models/userSchema");

const viewReports = async(req = request, res = response) =>
{
    // Añado filtros para dar la opción de filtrar los reportes desde el cliente. Si no se añaden muestra todos los reportes
    const { field, filter } = req.body;

    // Creo un filtro opcional
    const query = {};
    query[field] = filter;

    // Si no hay ningún filtro muestra toda la colección
    const reports = await ReportSchema.find(query);

    res.json({
        reports
    });
}

const addReport = async(req = request, res = response) =>
{
    // Recibo el nombre de la imagen reportada y guardo el uid
    const { user_reported, reporting_user, image, description, category } = req.body;
    let uid_reported = null;

    if (category === 'user')
    {
        const { _id } = await UserSchema.findOne({ image });
        uid_reported = _id;
    } else if (category === 'album')
    {
        const { _id } = await AlbumSchema.findOne({ image });
        uid_reported = _id;
    } else
    {
        const { _id } = await PhotoSchema.findOne({ image });
        uid_reported = _id;
    }

    if (!uid_reported)
    {
        return res.status(401).json({
            message: 'Ha ocurrido un error'
        });
    }
   
    const report = new ReportSchema({ uid_reported, image_reported: image, user_reported, reporting_user, description, category });
    await report.save();

    res.json({
        message: 'Imagen reportada',
        report
    });
}

// Función para que el administrador cambie el estado del reporte
const editReport = async(req = request, res = response) =>
{
    // Recojo el uid de la imagen reportada
    const { uid_reported, state } = req.body;

    // Actualizo el estado de todos los reportes de esa publicación
    const report = await ReportSchema.updateMany({ uid_reported }, { state }, { new: true } ); 

    if (!report)
    {
        return res.json({
            message: 'El reporte indicado no existe'
        });
    }

    // Si el nuevo estado es aprobado borro la imagen reportada
    if (state === 'approved')
    {
        await removeImage(uid_reported);
    }

    res.json({
        message: 'Se ha cambiado el estado del reporte',
        report
    });
}

const removeImage = async(uid_reported) =>
{
    // Obtengo los datos necesarios para borrar la imagen de mi API
    const { category, user_reported, image_reported } = await ReportSchema.findOne({ uid_reported });

    const pathImage = path.join(__dirname, '../uploads', user_reported, category, image_reported);
    
    // Borro la imagen de la API
    if (fs.existsSync(pathImage))
    {
        fs.unlinkSync(pathImage);
    }

    // Borro la imagen de la BD
    if (category === 'avatar')
    {
        await UserSchema.findOneAndDelete({ image: image_reported });
    } 
    else if (category === 'album')
    {
        await AlbumSchema.findOneAndDelete({ image: image_reported });
    } 
    else if (category === 'photo')
    {
        await PhotoSchema.findOneAndDelete({ image: image_reported });
    }
}

module.exports =
{
    addReport,
    viewReports,
    editReport
}