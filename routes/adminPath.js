const { Router } = require("express");

const { viewUsers } = require("../controllers/adminController");

const validateAdmin = require("../middlewares/validateAdmin");
const validateJWT = require("../middlewares/validateJWT");


const router = Router();

router.get('/usuarios', [
    validateJWT,
    validateAdmin
], viewUsers);

module.exports = router;