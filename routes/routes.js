const routes = (app) =>
{
    // Ruta principal de la apliación
    app.use('/api/user', require('./userPath'));
    app.use('/api/auth', require('./authPath'));
    app.use('/api/albumes', require('./albumPath'));
    app.use('/api/fotografias', require('./photoPath'));
    app.use('/api/explore', require('./explorePath'));
    app.use('/api/likesphoto', require('./likePath'));
    app.use('/api/report', require('./reportPath'));
    
    app.use('/api/upload', require('./uploadPath'));
    
    // Rutas para los administradores
    app.use('/api/panel', require('./adminPath'));
}

module.exports = routes;