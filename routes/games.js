const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  validateCreateClothingItem,
  validateId,
} = require("../middlewares/validation");
const {
  getGames,
} = require("../controllers/games");

router.get("/", getGames);

// router.delete("/:_id", auth, validateId, deleteClothingItem);
// router.post("/", validateCreateClothingItem, auth, createClothingItem);
// router.put("/:_id/likes", auth, validateId, likeItem);
// router.delete("/:_id/likes", auth, validateId, dislikeItem);

module.exports = router;
