const routes = (app) =>
{
    // Ruta principal de la apliación
    app.use('/', require('./usuarios'));





    
    app.use('/auth', require('./auth'));
}

module.exports = routes;