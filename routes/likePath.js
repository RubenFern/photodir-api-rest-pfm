const { Router } = require("express");
const { check, param } = require("express-validator");

const validateJWT = require("../middlewares/validateJWT");

const { addLike, removeLike, getLikes, checkLike } = require("../controllers/likeController");
const showErros = require("../middlewares/showErrors");
const { photoExists } = require("../helpers/validatePhoto");


const router = Router();

router.get('/:image', [
    param('image', 'Debes seleccionar una imagen').notEmpty(),
    param('image').custom(photoExists),
    showErros
], getLikes);

router.post('/checklike', [
    validateJWT,
    check('image', 'Debes especificar el nombre de la imagen a dar like').notEmpty(),
    check('image').custom(photoExists),
    showErros
], checkLike);

router.post('/addlike', [
    validateJWT,
    check('image', 'Debes especificar el nombre de la imagen a dar like').notEmpty(),
    check('image').custom(photoExists),
    showErros
], addLike);

router.post('/removelike', [
    validateJWT,
    check('image', 'Debes especificar el nombre de la imagen a dar like').notEmpty(),
    check('image').custom(photoExists),
    showErros
], removeLike);

module.exports = router;