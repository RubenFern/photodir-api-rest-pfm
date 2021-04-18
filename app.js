require('dotenv').config()
const express = require('express');
const app = express();

const server = require('./server/server');
const database = require('./database/config');
const middleware = require('./middlewares/middleware');
const routes = require('./routes/routes');

// Arranco el servidor
server(app);

// Me conecto a la base de datos
database();

// Middlewares
middleware(app, express);

// Rutas de la aplicación
routes(app);