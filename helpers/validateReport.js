const ReportSchema = require("../models/reportSchema");


const reportExists = async(uid_reported) =>
{
    const report = await ReportSchema.findOne({uid_reported});

    if (!report)
    {
        throw new Error('El reporte no existe');
    }
}

module.exports = 
{
    reportExists
}