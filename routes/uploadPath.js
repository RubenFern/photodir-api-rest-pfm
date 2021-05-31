const { Router } = require("express");
const { check } = require("express-validator");

const { uploadImage, getImage, getImageToken, getAvatar } = require("../controllers/uploadController");
const { validateFolderEndPoint } = require("../helpers/validateFolderEndPoint");
const { userExists } = require("../helpers/validateUser");
const showErros = require("../middlewares/showErrors");
const validateJWT = require("../middlewares/validateJWT");

const router = Router();

// Endpoint para visualizar las imágenes del propio usuario conectado
router.get('/token/:folder/:user_name/:image', [
    validateJWT,
    check('user_name').custom(userExists),
    check('folder').custom(fold => validateFolderEndPoint(fold)),
    showErros
], getImageToken);

// Endpoint para visualizar imágenes de otros usuarios
router.get('/notoken/:folder/:user_name/:image', [
    check('user_name').custom(userExists),
    check('folder').custom(fold => validateFolderEndPoint(fold)),
    showErros
], getImage);

// Endpoint para visualizar los avatar que son públicos
router.get('/avatar/:user_name/:image', [
    check('user_name').custom(userExists),
    showErros
], getAvatar);

router.post('/:folder', validateJWT, uploadImage);

module.exports = router;