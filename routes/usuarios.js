const { Router } = require("express");
const { check } = require("express-validator");

// Llamo a la función de validación
const { validarUsuario, existeEmail, existeUsuario } = require("../middlewares/usuarioRequest");
const validarJWT = require("../middlewares/validarJWT");

// Llamada al controlador
const {viewUsers, addUser, editUser, deleteUser} = require('./../controllers/usuarioController');

const router = Router();

router.get('/', viewUsers);

router.post('/', [
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('email', 'El correo electrónico es obligatorio').notEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({min: 6}),
    check('email').custom(existeEmail),
    validarUsuario
], addUser);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuario),
    validarUsuario
], editUser);

//router.patch('/:id', editUser);

// Protejo la ruta eliminar con la validación de token. *Todas las funciones dentro de la ruta comparten el mismo request*
router.delete('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuario),
    validarUsuario
], deleteUser)

module.exports = router;