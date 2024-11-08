const Game = require("../models/game");
const {
  BAD_REQUEST,
  RESOURCE_NOT_FOUND,
  FORBIDDEN_REQUEST,
} = require("../utils/errors");

module.exports.getGames = (req, res, next) => {
  Game.find({})
    .then((games) => res.send({ data: games }))
    .catch(next);
};

module.exports.deleteGame = (req, res, next) => {
  Game.findById(req.params._id)
    .orFail(() => {
      const error = new RESOURCE_NOT_FOUND(
        `No matching item in database for id '${req.params._id}'`
      );
      throw error;
    })
    .then((item) => {
      if (!item.owner._id.equals(req.user._id)) {
        throw new FORBIDDEN_REQUEST("User does not have permissions to delete");
      } else {
        Game.deleteOne({ _id: item._id })
          .then((deletedItem) => res.send({ data: deletedItem }))
          .catch((err) => {
            throw err;
          });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new BAD_REQUEST(
            `No matching item for id '${req.params._id}', id format is invalid.`
          )
        );
      } else {
        next(err);
      }
    });
};

module.exports.createGame = (req, res, next) => {
  const { name, imageUrl, weather } = req.body;
  Game.create({ name, imageUrl, owner: req.user, weather })
    .then((game) => res.send(game))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BAD_REQUEST(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.likeItem = (req, res, next) => {
  Game.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail(() => {
      const error = new RESOURCE_NOT_FOUND(
        `No matching item in database for id '${req.params._id}'`
      );
      throw error;
    })
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new BAD_REQUEST(
            `No matching item for id '${req.params._id}', id format is invalid.`
          )
        );
      } else {
        next(err);
      }
    });
};

module.exports.dislikeItem = (req, res, next) => {
  Game.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail(() => {
      const error = new RESOURCE_NOT_FOUND(
        `No matching item for id ${req.params.id}`
      );
      throw error;
    })
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new BAD_REQUEST(
            `No matching item for id '${req.params._id}', id format is invalid.`
          )
        );
      } else {
        next(err);
      }
    });
};
