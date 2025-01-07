const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const { BAD_REQUEST } = require("../utils/errors");
const { handleError } = require("../middlewares/errorHandler");

module.exports.signin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return handleError(new BAD_REQUEST("Incorrect password or email"), res);
  }
  User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({
        token,
        _id: user._id,
        name: user.name,
        email: user.email,
        likedGames: user.likedGames,
        playedGames: user.playedGames,
        wantedGames: user.wantedGames,
      });
    })
    .catch(next);
};
