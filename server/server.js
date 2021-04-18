const server = (app) =>
{
    // Establezco el puerto
    const port = process.env.PORT; 
    app.set('port', port);

    // Arranco el servidor
    app.listen(port);
}

module.exports = server;