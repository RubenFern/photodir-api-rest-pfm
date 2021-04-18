const { Router } = require("express");
const { check } = require("express-validator");

// Llamo a la función de validación
const { validateUser, emailExists, userExists, userNameExists } = require("../middlewares/usuarioRequest");
const validarJWT = require("../middlewares/validarJWT");

// Llamada al controlador
const {viewUser, addUser, editUser, deleteUser} = require('./../controllers/usuarioController');

const router = Router();

router.get('/:user_name', [
    check('user_name').custom(userExists),
    validateUser
], viewUser);

router.post('/registrate', [
    check('user_name').custom(userNameExists),
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('email', 'El correo electrónico es obligatorio').notEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({min: 6}),
    check('email').custom(emailExists),
    validateUser
], addUser);

// Llamo a la función que me valida el token, si el usuario que se conecta lo tiene obtengo su uid
router.put('/editar-perfil', [
    validarJWT,
    //check('user_name').custom(userExists),
    validateUser
], editUser);

//router.patch('/:id', editUser);

// Protejo la ruta eliminar con la validación de token. *Todas las funciones dentro de la ruta comparten el mismo request*
router.delete('/:user_name', [
    validarJWT,
    check('user_name').custom(userExists),
    validateUser
], deleteUser)

module.exports = router;