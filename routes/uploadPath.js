const { Router } = require("express");

const { uploadImage } = require("../controllers/uploadController");
const validateJWT = require("../middlewares/validateJWT");

const router = Router();

router.post('/:folder', validateJWT, uploadImage);

module.exports = router;