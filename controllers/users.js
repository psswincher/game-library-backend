const User = require("../models/user");
const { BAD_REQUEST, RESOURCE_NOT_FOUND } = require("../utils/errors");

const updateUserOptions = {
  new: true, //
  runValidators: true,
  upsert: true, // if the user entry wasn't found, it will be created
};

module.exports.updateUser = (req, res, next) => {
  const updates = {};
  const { name } = req.body;
  if (name) updates.name = name;
  if (updates) {
    User.findByIdAndUpdate(req.user, updates, updateUserOptions)
      .orFail(() => {
        const error = new RESOURCE_NOT_FOUND(
          `No matching user for id '${req.user}'`
        );
        throw error;
      })
      .then((user) => {
        res.send({
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            likedGames: user.likedGames,
            playedGames: user.playedGames,
          },
        });
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          next(new BAD_REQUEST(err.message));
        } else if (err.name === "CastError") {
          next(
            new BAD_REQUEST(
              `Can't find user by id '${req.user}', format is invalid.`
            )
          );
        } else {
          next(err);
        }
      });
  }
  return null;
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user)
    .orFail(() => {
      const error = new RESOURCE_NOT_FOUND(
        `No matching user for id '${req.user}'`
      );
      throw error;
    })
    .then((user) =>
      res.send({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          likedGames: user.likedGames,
          playedGames: user.playedGames,
          wantedGames: user.wantedGames,
        },
      })
    )
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new BAD_REQUEST(
            `Can't find user by id '${req.user}', format is invalid.`
          )
        );
      } else {
        next(err);
      }
    });
};

module.exports.addLikedGame = (req, res, next) => {
  console.log("Like game called");
  const { gameId } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { likedGames: gameId } },
    updateUserOptions
  )
    .orFail(() => {
      const error = new RESOURCE_NOT_FOUND(
        `No matching user for id '${req.user}'`
      );
      throw error;
    })
    .then((user) => {
      res.send({
        user: {
          likedGames: user.likedGames,
        },
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BAD_REQUEST(err.message));
      } else if (err.name === "CastError") {
        next(
          new BAD_REQUEST(
            `Can't find user by id '${req.user}', format is invalid.`
          )
        );
      } else {
        next(err);
      }
    });
};

module.exports.removeLikedGame = (req, res, next) => {
  console.log("Removed like called.");
  const { gameId } = req.body;
  console.log("user id is:", req.user._id);
  User.findByIdAndUpdate(
    req.user._id,
    { $pull: { likedGames: gameId } },
    updateUserOptions
  )
    .orFail(() => {
      const error = new RESOURCE_NOT_FOUND(
        `No matching user for id '${req.user}'`
      );
      throw error;
    })
    .then((user) => {
      res.send({
        user: {
          likedGames: user.likedGames,
        },
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BAD_REQUEST(err.message));
      } else if (err.name === "CastError") {
        next(
          new BAD_REQUEST(
            `Can't find user by id '${req.user}', format is invalid.`
          )
        );
      } else {
        next(err);
      }
    });
};

module.exports.addPlayedGame = (req, res, next) => {
  console.log("Played game called");
  const { gameId } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { playedGames: gameId } },
    updateUserOptions
  )
    .orFail(() => {
      const error = new RESOURCE_NOT_FOUND(
        `No matching user for id '${req.user}'`
      );
      throw error;
    })
    .then((user) => {
      res.send({
        user: {
          playedGames: user.playedGames,
        },
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BAD_REQUEST(err.message));
      } else if (err.name === "CastError") {
        next(
          new BAD_REQUEST(
            `Can't find user by id '${req.user}', format is invalid.`
          )
        );
      } else {
        next(err);
      }
    });
};

module.exports.removePlayedGame = (req, res, next) => {
  console.log("Unplayed like called.");
  const { gameId } = req.body;
  console.log("user id is:", req.user._id);
  User.findByIdAndUpdate(
    req.user._id,
    { $pull: { playedGames: gameId } },
    updateUserOptions
  )
    .orFail(() => {
      const error = new RESOURCE_NOT_FOUND(
        `No matching user for id '${req.user}'`
      );
      throw error;
    })
    .then((user) => {
      res.send({
        user: {
          playedGames: user.playedGames,
        },
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BAD_REQUEST(err.message));
      } else if (err.name === "CastError") {
        next(
          new BAD_REQUEST(
            `Can't find user by id '${req.user}', format is invalid.`
          )
        );
      } else {
        next(err);
      }
    });
};

module.exports.addWantedGame = (req, res, next) => {
  console.log("Wanted game called");
  const { gameId } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wantedGames: gameId } },
    updateUserOptions
  )
    .orFail(() => {
      const error = new RESOURCE_NOT_FOUND(
        `No matching user for id '${req.user}'`
      );
      throw error;
    })
    .then((user) => {
      res.send({
        user: {
          wantedGames: user.wantedGames,
        },
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BAD_REQUEST(err.message));
      } else if (err.name === "CastError") {
        next(
          new BAD_REQUEST(
            `Can't find user by id '${req.user}', format is invalid.`
          )
        );
      } else {
        next(err);
      }
    });
};

module.exports.removeWantedGame = (req, res, next) => {
  console.log("Remove wanted called.");
  const { gameId } = req.body;
  console.log("user id is:", req.user._id);
  User.findByIdAndUpdate(
    req.user._id,
    { $pull: { wantedGames: gameId } },
    updateUserOptions
  )
    .orFail(() => {
      const error = new RESOURCE_NOT_FOUND(
        `No matching user for id '${req.user}'`
      );
      throw error;
    })
    .then((user) => {
      res.send({
        user: {
          wantedGames: user.wantedGames,
        },
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BAD_REQUEST(err.message));
      } else if (err.name === "CastError") {
        next(
          new BAD_REQUEST(
            `Can't find user by id '${req.user}', format is invalid.`
          )
        );
      } else {
        next(err);
      }
    });
};
