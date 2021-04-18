const mongoose = require('mongoose');

const conexionDB = async() =>
{
    try 
    {
        await mongoose.connect(process.env.MONGODB_CNN,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('Base de datos conectada');

    } catch(error)
    {
        console.log(error);
        throw new Error('Error en la conexión con la Base de Datos');
    }
}

module.exports = conexionDB;