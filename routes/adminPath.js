const { Router } = require("express");
const { check, param } = require("express-validator");

const { viewUsers, setRoleAdmin, getImageFromUser, deleteUser, viewAlbums, viewUser, viewPhotos, deletePhoto } = require("../controllers/adminController");
const { albumExists } = require("../helpers/validatePhoto");
const { userExists } = require("../helpers/validateUser");

const isAdmin = require("../middlewares/isAdmin");
const showErros = require("../middlewares/showErrors");
const validateJWT = require("../middlewares/validateJWT");

const router = Router();

router.get('/users', [
    validateJWT,
    isAdmin
], viewUsers);

router.get('/user/:user_name', [
    validateJWT,
    isAdmin,
    param('user_name').custom(userExists),
    showErros
], viewUser);

router.get('/albums/:user_name', [
    validateJWT,
    isAdmin,
    param('user_name').custom(userExists),
    showErros
], viewAlbums);

router.get('/photos/:user_name/:album', [
    validateJWT,
    isAdmin,
    param('user_name').custom(userExists),
    param('album').custom(albumExists),
    showErros
], viewPhotos);

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


router.delete('/photo/:image', [
    validateJWT,
    isAdmin,
    param('image', 'Debes añadir una imagen').notEmpty(),
    showErros
], deletePhoto);

module.exports = router;