const { Router } = require("express");

const { viewUsers } = require("../controllers/adminController");

const isAdmin = require("../middlewares/isAdmin");
const validateJWT = require("../middlewares/validateJWT");

const router = Router();

router.get('/usuarios', [
    validateJWT,
    isAdmin
], viewUsers);

module.exports = router;