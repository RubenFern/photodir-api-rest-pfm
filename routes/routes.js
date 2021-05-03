const routes = (app) =>
{
    // Ruta principal de la apliación
    app.use('/api', require('./userPath'));
    app.use('/api/auth', require('./authPath'));
    app.use('/api/albumes', require('./albumPath'));
    
    app.use('/api/upload', require('./uploadPath'));
    
    // Rutas para los administradores
    app.use('/api/panel', require('./adminPath'));
}

module.exports = routes;