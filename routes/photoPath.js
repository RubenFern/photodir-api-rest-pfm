const { Router } = require("express");
const { check, param } = require("express-validator");

const { viewPhotos, addPhoto, editPhoto, deletePhoto } = require("../controllers/photoController");

const validateJWT = require("../middlewares/validateJWT");
const showErros = require("../middlewares/showErrors");
const albumExists = require("../helpers/validateAlbum");
const { userExists } = require("../helpers/validateUser");


const router = Router();

router.get('/:user_name/:album', [
    param('user_name').custom(userExists), // Los álbumes los compruebo en el controlador usando una función ya creada
    showErros
], viewPhotos);

/**
 * Uso el token para obtener el usuario conectado y así añadir el álbum en su perfil
 */
router.post('/:album', [
    validateJWT,
    check('image', 'Debes seleccionar una fotografía').notEmpty(),
    showErros
], addPhoto);

router.put('/:photo_name', [
    validateJWT
], editPhoto);

router.delete('/:photo_name', [
    validateJWT
], deletePhoto);

module.exports = router;