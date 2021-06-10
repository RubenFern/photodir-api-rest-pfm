const { Router } = require("express");
const { check, param } = require("express-validator");

const { viewUsers, setRoleAdmin, getImageFromUser, deleteUser } = require("../controllers/adminController");
const { userExists } = require("../helpers/validateUser");

const isAdmin = require("../middlewares/isAdmin");
const showErros = require("../middlewares/showErrors");
const validateJWT = require("../middlewares/validateJWT");

const router = Router();

router.get('/users', [
    validateJWT,
    isAdmin
], viewUsers);

router.put('/setadmin', [
    validateJWT,
    isAdmin,
    check('user_name').custom(userExists),
    showErros
], setRoleAdmin);

router.get('/image/:user_name/:category/:image', [
    validateJWT,
    isAdmin,
    param('user_name').custom(userExists),
    param('category', 'Debes seleccionar una categoría válida [user, album, photo]').custom( (option) => ['avatar', 'album', 'photo'].includes(option)),
    showErros
], getImageFromUser);

router.delete('/', [
    validateJWT,
    isAdmin,
    check('user_name').custom(userExists),
    showErros
], deleteUser);

module.exports = router;