const { Router } = require("express");
const { check } = require("express-validator");

const { uploadImage } = require("../controllers/uploadController");

const showErros = require("../middlewares/showErrors");
const validateJWT = require("../middlewares/validateJWT");

const router = Router();

router.post('/', uploadImage);

module.exports = router;