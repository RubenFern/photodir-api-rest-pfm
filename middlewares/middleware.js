const cors = require('cors');
const fileUpload = require('express-fileupload');

const middleware = (app, express) =>
{
    // CORS
    app.use(cors());

    // Las peticiones que reciba se transforman en JSON
    app.use(express.json());

    // Directorio público
    app.use(express.static('public'));

    // Carga de archivos habilitada
    app.use(fileUpload({
        useTempFiles : true,
        tempFileDir : '/tmp/'
    }));
}

module.exports = middleware;