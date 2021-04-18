# API-Rest-ExpressJS

Esta es una API-Rest realizada a modo de práctica.

### Para usar como plantilla
- Descargar el .ZIP o realizar un fork a este repositorio.

- Abrir la carpeta en una consola de comandos y ejecutar `npm install` para instalar todas las dependecias de la API.

### Descripción

API Rest funcionando para el control de usuarios en una base de datos MongoDB

Tiene implementado el `intercambio de recursos de origen cruzado - CORS` para todas las rutas.

- La visualización de usuarios se realizar con la ruta `/api/usuarios`. Es posible añadir los parámetros `limit` y `from` para establecer el límite de resultados y el comienzo de la búsqueda

- En la creación de usuarios se usa el paquete de NPM bcryptjs para hashear las contraseñas que se añadan en la base de datos.

- Para editar o borrar los usuarios se usa la ruta `/api/usuarios/{id}`. En en el caso de editar no es posible cambiar el correo electrónico, en cambio los demás campos son opcionales. En caso de editar la contraseña se vuelve a llamar a la función hash y se guarda en la instancia.

Todo el CRUD cuenta con control de errores gracias al paquete de NPM express-validator.