const { Router } = require("express");
const { check } = require("express-validator");

const { loadImage } = require("../controllers/uploadController");

const showErros = require("../middlewares/showErrors");
const validateJWT = require("../middlewares/validateJWT");

const router = Router();

router.post('/', validateJWT, loadImage);

module.exports = router;