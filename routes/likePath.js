const { Router } = require("express");
const { check, param } = require("express-validator");

const validateJWT = require("../middlewares/validateJWT");

const { addLike, removeLike, viewLikes } = require("../controllers/likeController");
const showErros = require("../middlewares/showErrors");


const router = Router();

router.get('/viewlikes/:image', [
    check('image', 'Debes seleccionar una imagen').notEmpty(),
    showErros
], viewLikes);

router.get('/addlike/:uid_photo', [
    validateJWT,
    param('uid_photo', 'El id de la imagen no es válido').isMongoId(),
    showErros
], addLike);

router.get('/removelike/:uid_photo', [
    validateJWT,
    param('uid_photo', 'El id de la imagen no es válido').isMongoId(),
    showErros
], removeLike);

module.exports = router;