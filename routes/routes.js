const routes = (app) =>
{
    // Ruta principal de la apliación
    app.use('/api', require('./userPath'));
    app.use('/api/login', require('./authPath'));
    app.use('/api/albumes', require('./albumPath'));

    
    // Rutas para los administradores
    app.use('/api/panel', require('./adminPath'));
}

module.exports = routes;