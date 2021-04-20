const { Router } = require("express");
const { check } = require("express-validator");

const { viewAlbums, addAlbum, editAlbum, deleteAlbum } = require("../controllers/albumController");

const validateJWT = require("../middlewares/validateJWT");
const { userExists } = require("../helpers/validateUser");
const showErros = require("../middlewares/showErrors");


const router = Router();

router.get('/:user_name', [
    check('user_name').custom(userExists),
    showErros
], viewAlbums);

/**
 * Uso el token para obtener el usuario conectafo y así añadir el álbum en su perfil
 */
router.post('/', [
    validateJWT,
    
], addAlbum);

router.put('/:album_name', [
    // Valido el token del usuario conectado
    // Valido que exista el álbum
], editAlbum);

router.delete('/:album_name', [
    // Valido el token del usuario conectado
    // Valido que exista el álbum
], deleteAlbum);

module.exports = router;