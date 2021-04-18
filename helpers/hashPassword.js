const bcryptjs = require('bcryptjs');

// Encripto la contraseña
const hashPassword = (model, password) =>
{
    // El salt por defecto hace 10 vueltas
    const salt = bcryptjs.genSaltSync(); 
    model.password = bcryptjs.hashSync(password, salt);
}

module.exports = {
    hashPassword
};
