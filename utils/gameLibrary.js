//game manager is a singleton class that

const { gameAdapter, FormattedGame } = require("./GameAdapter");
const Game = require("../models/game");
const { uploadImageToGridFS } = require("./imageToGridFS");
const { uploadImageFromAirtableToS3 } = require("./aws");

//Eventually, this object will also handle a service that sends
//user interaction data with games back to Airtable for review on site.
//for now, it is only geared towards sending data to airtable.

module.exports.GameManager = {
  updateLibrary: async function (games, gfsBucket) {
    const bulkOperations = [];
    const count = await Game.countDocuments();
    console.log(`Connected to: ${Game.db.host}:${Game.db.port}`);
    console.log(`Document count before bulkWrite: ${count}`);
    for (const rawGame of games) {
      //formats game data into something more dev friendly. Can be updated if we change how we handle the backend interface
      let game = gameAdapter(rawGame);

      if (game instanceof FormattedGame) {
        // console.log(game);

        if (game.airtableImageUrl) {
          uploadImageFromAirtableToS3(game)
            .then((imageUrl) => {
              console.log(imageUrl);
              game.imageUrl = imageUrl;
            })
            .catch((err) => console.log(err));
          // const fileId = await uploadImageToGridFS(game.imageUrl, game.recordId, gfsBucket);
        }

        bulkOperations.push({
          updateOne: {
            filter: { _id: game._id },
            update: { ...game },
            upsert: true,
          },
        });
      }
    }
    console.log("Bulk operations:", bulkOperations);

    try {
      const result = await Game.bulkWrite(bulkOperations);
      console.log("BulkWrite Result:", result);
    } catch (error) {
      console.error("BulkWrite Error:", error);
    }
  },
};
