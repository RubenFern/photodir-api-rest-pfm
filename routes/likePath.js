const { Router } = require("express");
const { check } = require("express-validator");

const validateJWT = require("../middlewares/validateJWT");

const { addLike, removeLike } = require("../controllers/likeController");
const showErros = require("../middlewares/showErrors");


const router = Router();

// Endpoint para buscar usuarios
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