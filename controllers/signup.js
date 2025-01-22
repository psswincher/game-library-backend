const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { BAD_REQUEST, NON_UNIQUE_SUBMISSION } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        email,
        password: hash,
        likedGames: [],
        wantedGames: [],
        playedGames: [],
      })
        .then((user) => {
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: "7d",
          });
          res.status(201).send({
            token,
            user: {
              _id: user._id,
              email: user.email,
              name: user.name,
            },
          });
        })
        .catch((err) => {
          if (err.name === "ValidationError") {
            next(new BAD_REQUEST(err.message));
          } else if (err.code === 11000) {
            next(new NON_UNIQUE_SUBMISSION(err.message));
          } else {
            next(err);
          }
        })
    )
    .catch(next);
};
