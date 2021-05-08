const { Router } = require("express");
const { check } = require("express-validator");

const { uploadImage, getImage } = require("../controllers/uploadController");
const { validateFolderEndPoint } = require("../helpers/validateFolderEndPoint");
const { userExists } = require("../helpers/validateUser");
const showErros = require("../middlewares/showErrors");
const validateJWT = require("../middlewares/validateJWT");

const router = Router();

// Endpoint para visualizar las imágenes del usuario
router.get('/:folder/:user_name/:image', [
    check('user_name').custom(userExists),
    check('folder').custom(fold => validateFolderEndPoint(fold)),
    showErros
], getImage);

router.post('/:folder', validateJWT, uploadImage);

module.exports = router;