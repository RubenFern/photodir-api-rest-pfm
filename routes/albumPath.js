const { Router } = require("express");
const { check } = require("express-validator");

const { viewAlbums, addAlbum, editAlbum, deleteAlbum, deleteImage } = require("../controllers/albumController");

const validateJWT = require("../middlewares/validateJWT");
const showErros = require("../middlewares/showErrors");
const { userExists } = require("../helpers/validateUser");


const router = Router();

router.get('/:user_name', [
    check('user_name').custom(userExists),
    showErros
], viewAlbums);

/**
 * Uso el token para obtener el usuario conectado y así añadir el álbum en su perfil
 */
router.post('/', [
    validateJWT,
    check('name', 'El álbum debe tener un nombre').notEmpty(),
    showErros
], addAlbum);

router.put('/:album_name', [
    validateJWT,
    check('name', 'El álbum debe tener un nombre').optional().notEmpty(),
    showErros
], editAlbum);

router.delete('/:album_name', [
    validateJWT
], deleteAlbum);

router.delete('/image/:album_name', [
    validateJWT
], deleteImage);

module.exports = router;