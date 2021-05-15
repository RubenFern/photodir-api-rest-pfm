const { Router } = require("express");
const { check, param } = require("express-validator");

const { viewPhotos, addPhoto, editPhoto, deletePhoto, viewPhoto } = require("../controllers/photoController");

const validateJWT = require("../middlewares/validateJWT");
const showErros = require("../middlewares/showErrors");
const albumExists = require("../helpers/validateAlbum");
const { userExists } = require("../helpers/validateUser");


const router = Router();

router.get('/:user_name/:album', [
    param('user_name').custom(userExists), // Los álbumes los compruebo en el controlador usando una función ya creada
    showErros
], viewPhotos);

router.get('/:uid', [
    param('uid', 'EL id no es válido').isMongoId(),
    showErros
], viewPhoto);

/**
 * Uso el token para obtener el usuario conectado y así añadir el álbum en su perfil
 */
router.post('/:album', [
    validateJWT,
    check('image', 'Debes seleccionar una fotografía').notEmpty(),
    showErros
], addPhoto);

router.put('/:uid', [
    validateJWT,
    param('uid', 'El uid no es válido').isMongoId(),
    showErros
], editPhoto);

router.delete('/:uid', [
    validateJWT,
    param('uid', 'El uid no es válido').isMongoId(),
    showErros
], deletePhoto);

module.exports = router;