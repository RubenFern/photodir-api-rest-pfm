const routes = (app) =>
{
    // Ruta principal de la apliación
    app.use('/', require('./userPath'));
    app.use('/', require('./authPath'));
}

module.exports = routes;