const { Router } = require("express");
const { check } = require("express-validator");

const { userExists } = require("../helpers/validateUser");
const showErros = require('./../middlewares/showErrors');

// Llamada al controlador
const { searchUser } = require("../controllers/exploreController");


const router = Router();

// Endpoint para buscar usuarios
router.get('/:user_name', searchUser);

module.exports = router;