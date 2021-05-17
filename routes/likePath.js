const { Router } = require("express");
const { check, param } = require("express-validator");

const validateJWT = require("../middlewares/validateJWT");

const { addLike, removeLike, viewLikes } = require("../controllers/likeController");
const showErros = require("../middlewares/showErrors");


const router = Router();

router.get('/viewlikes/:uid_photo', [
    param('uid_photo', 'El id de la imagen no es válido').isMongoId(),
    showErros
], viewLikes);

router.get('/addlike', [
    validateJWT,
    check('image', 'Debes seleccionar una imagen').notEmpty(),
    showErros
], addLike);

router.get('/removelike', [
    validateJWT,
    check('image', 'Debes seleccionar una imagen').notEmpty(),
    showErros
], removeLike);

module.exports = router;