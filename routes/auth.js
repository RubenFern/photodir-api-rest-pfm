const { Router } = require("express");
const { check } = require("express-validator");
const { login } = require("../controllers/authController");
const { validateUser } = require("../middlewares/usuarioRequest");

const router = Router();

router.post('/login', [
    check('user_name', 'Debes introducir tu nombre de usuario').notEmpty(),
    check('password', 'Debes introducir tu contraseña').notEmpty(),
    validateUser
], login);

module.exports = router;