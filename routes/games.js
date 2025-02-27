const router = require("express").Router();
// const { auth } = require("../middlewares/auth");
// const {
//   validateCreateClothingItem,
//   validateId,
// } = require("../middlewares/validation");
const { getGames } = require("../controllers/games");

router.get("/", getGames);

module.exports = router;
