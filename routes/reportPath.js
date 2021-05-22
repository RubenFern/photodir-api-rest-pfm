const { Router } = require("express");
const { check } = require("express-validator");


const validateJWT = require("../middlewares/validateJWT");
const isAdmin = require("../middlewares/isAdmin");
const showErros = require("../middlewares/showErrors");

const { addReport, viewReports, editReport } = require("../controllers/reportController");

const { userExists } = require("../helpers/validateUser");
const { photoExists } = require("../helpers/validatePhoto");
const { reportExists } = require("../helpers/validateReport");

const router = Router();

router.get('/', [
    validateJWT,
    isAdmin
], viewReports);

// Esta ruta solo la valido con el Token porque son los usuarios los que reportan
router.post('/', [
    validateJWT,
    check('user_reported').custom(userExists),
    check('reporting_user').custom(userExists),
    check('image').custom(photoExists),
    check('description', 'Debes indicar el motivo del reporte').notEmpty(),
    check('category', 'Debes seleccionar una categoría válida [user, album, photo]').custom( (option) => ['avatar', 'album', 'photo'].includes(option)),
    showErros
], addReport);

router.put('/', [
    validateJWT,
    isAdmin,
    check('uid_reported').custom(reportExists),
    check('state', 'El estado debe ser <<approved, rejected, pending>>').custom( (state) => ['approved', 'rejected', 'pending'].includes(state)),
    showErros
], editReport);

module.exports = router;