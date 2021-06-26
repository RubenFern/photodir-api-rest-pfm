# API Rest en Node :zap:

Esta API es una parte del proyecto de fin de módulo que trabaja conjuntamente con la [interfaz de React](https://github.com/RubenFern/Photodir-PFM-Front-React) que se ejecutan en el front-end.

La API está realizada en base al Stack de MERN, con tecnologías como Express y Node, junto a Mongoose para el manejo de la base de datos de MongoDB.

## Requisitos :heavy_check_mark:

1. Tener instalado Node en el equipo. [Web oficial](https://nodejs.org/en/).
2. Tener instalada una base de datos de MongoDB localmente o crear un clúster que proporciona MongoDB gratuitamente. [Web oficial](https://www.mongodb.com/).
3. El archivo .env debe contener las variables de entorno que requiera la API, como la conexión con la base de datos, la clave para generar Tokens o el puerto de conexión del servidor.

## Instalación :rocket:

Para instalar la API y usarla, puedes descargar este proyecto o realizar un fork o clone. 

Una vez tengas el código fuente accede al directorio donde se encuentra desde un terminal de consola y ejecuta.

```
npm install
```

Esto instalará todas las dependencias del proyecto. Dependiendo de tu velocidad de conexión y de disco duro tardará más o menos.

A continuación puedes encender la API con el comando.

```
node app.js
```

o

```
nodemon app.js
```

Con esto ya puedes empezar a realizar peticiones a la API.

## Tecnologías :computer:

- **bcryptjs - v2.4.3**
- **cors - v2.8.5**
- **dotenv - v8.2.0**
- **express - v4.17.1**
- **express-fileupload - v1.2.1**
- **express-validator - v6.10.0**
- **jsonwebtoken - v8.5.1**
- **mongoose - v5.12.5**
- **nodemon - v2.0.7**
- **uuid - v8.3.2**