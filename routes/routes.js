const routes = (app) =>
{
    // Rutas para los usuarios
    app.use('/api/usuarios', require('./usuarios'));
    app.use('/api/auth', require('./auth'));
}

module.exports = routes;