const routes = (app) =>
{
    // Ruta principal de la apliación
    app.use('/', require('./usuarios'));
    app.use('/', require('./auth'));
}

module.exports = routes;