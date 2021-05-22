const { Router } = require("express");
const { check, param } = require("express-validator");

// Llamo a la función de validación
const { emailExists, userExists, userNameExists } = require("../helpers/validateUser");
const showErros = require('./../middlewares/showErrors');
const validateJWT = require("../middlewares/validateJWT");

// Llamada al controlador
const {viewUser, addUser, editUser, deleteUser} = require('../controllers/userController');

const router = Router();

router.get('/:user_name', [
    param('user_name').custom(userExists),
    showErros
], viewUser);

router.post('/', [
    check('user_name').custom(userNameExists),
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('email', 'El correo electrónico es obligatorio').notEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({min: 6}),
    check('email').custom(emailExists),
    showErros
], addUser);

// Llamo a la función que me valida el token, si el usuario que se conecta lo tiene obtengo su uid
router.put('/', [
    validateJWT,
    check('password', 'La contraseña debe tener al menos 6 caracteres').optional().isLength({min: 6}),
    showErros
], editUser);

//router.patch('/:id', editUser);

// Protejo la ruta eliminar con la validación de token. *Todas las funciones dentro de la ruta comparten el mismo request*
router.delete('/', [
    validateJWT
], deleteUser);

module.exports = router;