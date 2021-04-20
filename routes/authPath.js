const { Router } = require("express");
const { check } = require("express-validator");

const { login } = require("../controllers/authController");
const showErros = require("../middlewares/showErrors");

const router = Router();

router.post('/', [
    check('user_name', 'Debes introducir tu nombre de usuario').notEmpty(),
    check('password', 'Debes introducir tu contraseña').notEmpty(),
    showErros
], login);

module.exports = router;