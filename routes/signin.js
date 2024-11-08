const router = require("express").Router();
const { signin } = require("../controllers/signin");
const { validateSignin } = require("../middlewares/validation");

router.post("/", validateSignin, signin);

module.exports = router;
