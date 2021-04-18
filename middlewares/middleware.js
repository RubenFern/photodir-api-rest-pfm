const cors = require('cors');

const middleware = (app, express) =>
{
    // CORS
    app.use(cors());

    // Las peticiones que reciba se transforman en JSON
    app.use(express.json());

    // Directorio público
    app.use(express.static('public'));
}

module.exports = middleware;