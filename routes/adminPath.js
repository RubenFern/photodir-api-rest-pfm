const { Router } = require("express");
const { check } = require("express-validator");

const { viewUsers, setRoleAdmin } = require("../controllers/adminController");

const isAdmin = require("../middlewares/isAdmin");
const showErros = require("../middlewares/showErrors");
const validateJWT = require("../middlewares/validateJWT");

const router = Router();

router.get('/users', [
    validateJWT,
    isAdmin
], viewUsers);

router.get('/setadmin', [
    validateJWT,
    isAdmin,
    check('user_name', 'Debes especificar el nombre de usuario').notEmpty(),
    showErros
], setRoleAdmin);

module.exports = router;