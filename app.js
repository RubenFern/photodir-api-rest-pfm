require('dotenv').config()
const express = require('express');
const app = express();

// Funciones
const server = require('./server/server');
const middleware = require('./middlewares/middleware');
const routes = require('./routes/routes');
const database = require('./database/config');

// Arranco el servidor
server(app);

// Me conecto a la base de datos
database();

// Middlewares
middleware(app, express);

// Rutas de la aplicación
routes(app);