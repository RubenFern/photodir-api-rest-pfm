const routes = (app) =>
{
    // Ruta principal de la apliación
    app.use('/', require('./userPath'));
    app.use('/login', require('./authPath'));
    app.use('/albumes', require('./albumPath'));

    // Rutas para los administradores
    app.use('/panel', require('./adminPath'));
}

module.exports = routes;