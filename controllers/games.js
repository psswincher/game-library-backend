const Game = require("../models/game");
const gfsBucket = require("../utils/imageToGridFS");
const {
  BAD_REQUEST,
  RESOURCE_NOT_FOUND,
  FORBIDDEN_REQUEST,
} = require("../utils/errors");


//TO DO - eventually, we will need to only fetch games that are out of date/have new data
//I think this will be frontend logic that checks metadata for last access data?
//otherwise this could launch like 100-200 download streams to get all images all at once?
module.exports.getGames = (req, res, next) => {
  Game.find({})
    .then((games) => {

      return games.map((game) => {
        if(game.imageId) {
          const imageStream = gfsBucket.openDownloadStream(mongoose.Types.ObjectId(game.imageId));
          
          const chunks = [];
          for await (const chunk of imageStream) {
          chunks.push(chunk);
        }
        
        game.imageData = Buffer.concat(chunks).toString("base64");
        }
        
      }) 
    }).then((games) => {
      res.send({data: games});
    })
    .catch(next);
};

//keeping this code to potentially modify later
// module.exports.likeItem = (req, res, next) => {
//   Game.findByIdAndUpdate(
//     req.params._id,
//     { $addToSet: { likes: req.user } }, // add _id to the array if it's not there yet
//     { new: true }
//   )
//     .orFail(() => {
//       const error = new RESOURCE_NOT_FOUND(
//         `No matching item in database for id '${req.params._id}'`
//       );
//       throw error;
//     })
//     .then((data) => res.send(data))
//     .catch((err) => {
//       if (err.name === "CastError") {
//         next(
//           new BAD_REQUEST(
//             `No matching item for id '${req.params._id}', id format is invalid.`
//           )
//         );
//       } else {
//         next(err);
//       }
//     });
// };

// module.exports.dislikeItem = (req, res, next) => {
//   Game.findByIdAndUpdate(
//     req.params._id,
//     { $pull: { likes: req.user._id } }, // remove _id from the array
//     { new: true }
//   )
//     .orFail(() => {
//       const error = new RESOURCE_NOT_FOUND(
//         `No matching item for id ${req.params.id}`
//       );
//       throw error;
//     })
//     .then((data) => res.send(data))
//     .catch((err) => {
//       if (err.name === "CastError") {
//         next(
//           new BAD_REQUEST(
//             `No matching item for id '${req.params._id}', id format is invalid.`
//           )
//         );
//       } else {
//         next(err);
//       }
//     });
// };
