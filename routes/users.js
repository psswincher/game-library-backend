const router = require("express").Router();
const {
  getCurrentUser,
  updateUser,
  addLikedGame,
  removeLikedGame,
  addPlayedGame,
  removePlayedGame,
  addWantedGame,
  removeWantedGame,
} = require("../controllers/users");
const {
  validateUpdateUser,
  validateAddGame,
} = require("../middlewares/validation");

router.get("/me", getCurrentUser);
router.patch("/me", validateUpdateUser, updateUser);
router.patch("/me/likeGame", validateAddGame, addLikedGame);
router.patch("/me/unlikeGame", validateAddGame, removeLikedGame);
router.patch("/me/playedGame", validateAddGame, addPlayedGame);
router.patch("/me/unplayedGame", validateAddGame, removePlayedGame);
router.patch("/me/wantedGame", validateAddGame, addWantedGame);
router.patch("/me/unwantedGame", validateAddGame, removeWantedGame);

module.exports = router;
