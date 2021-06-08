const { response, request } = require("express");
const path = require('path');
const fs = require('fs');

const AlbumSchema = require("../models/albumSchema");
const PhotoSchema = require("../models/photoSchema");
const ReportSchema = require("../models/reportSchema");
const UserSchema = require("../models/userSchema");

const viewReports = async(req = request, res = response) =>
{
    const reports = await ReportSchema.find({});

    res.json({
        reports
    });
}

const addReport = async(req = request, res = response) =>
{
    // Recibo el nombre de la imagen reportada y guardo el uid
    const { user_reported, reporting_user, image, description, category } = req.body;
    let uid_image_reported = null;

    if (category === 'user')
    {
        const { _id } = await UserSchema.findOne({ image });
        uid_image_reported = _id;
    } else if (category === 'album')
    {
        const { _id } = await AlbumSchema.findOne({ image });
        uid_image_reported = _id;
    } else
    {
        const { _id } = await PhotoSchema.findOne({ image });
        uid_image_reported = _id;
    }

    if (!uid_image_reported)
    {
        return res.status(401).json({
            message: 'La imagen no existe'
        });
    }
   
    const report = new ReportSchema({ uid_image_reported, name_image_reported: image, user_reported, reporting_user, description, category });
    await report.save();

    res.json({
        message: 'Has reportado la imagen',
        report
    });
}

// Función para que el administrador cambie el estado del reporte
const editReport = async(req = request, res = response) =>
{
    // Recojo el uid de la imagen reportada
    const { uid_image_reported, state } = req.body;

    // Actualizo el estado de todos los reportes de esa publicación
    const report = await ReportSchema.updateMany({ uid_image_reported }, { state }, { new: true } ); 

    if (!report)
    {
        return res.json({
            message: 'El reporte indicado no existe'
        });
    }

    // Si el nuevo estado es aprobado borro la imagen reportada
    if (state === 'approved')
    {
        await removeImage(uid_image_reported);
    }

    res.json({
        message: 'Se ha actualizado con éxito el estado del reporte',
        report
    });
}

const removeImage = async(uid_image_reported) =>
{
    // Obtengo los datos necesarios para borrar la imagen de mi API
    const { category, user_reported, name_image_reported } = await ReportSchema.findOne({ uid_image_reported });

    const pathImage = path.join(__dirname, '../uploads', user_reported, category, name_image_reported);
    
    // Borro la imagen de la API
    if (fs.existsSync(pathImage))
    {
        fs.unlinkSync(pathImage);
    }

    // Borro la imagen de la BD o la actualizo para poner la de por defecto en el caso del avatar y álbum
    if (category === 'avatar')
    {
        await UserSchema.findOneAndUpdate({ image: name_image_reported }, { image: 'default_image.jpg' }); 
    } 
    else if (category === 'album')
    {
        await AlbumSchema.findOneAndUpdate({ image: name_image_reported }, { image: 'default_image.jpg' });
    } 
    else if (category === 'photo')
    {
        // Elimino la fotografía de la base de datos
        await PhotoSchema.findOneAndDelete({ image: name_image_reported });
    }
}

module.exports =
{
    addReport,
    viewReports,
    editReport
}