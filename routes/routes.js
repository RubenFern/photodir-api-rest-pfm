const routes = (app) =>
{
    // Ruta principal de la apliación
    app.use('/', require('./userPath'));
    app.use('/', require('./authPath'));

    // Rutas para los administradores
    app.use('/panel', require('./adminPath'));
}

module.exports = routes;