//game manager is a singleton class that

const { gameAdapter, FormattedGame } = require("./GameAdapter");
const Game = require("../models/game");

//Eventually, this object will also handle a service that sends
//user interaction data with games back to Airtable for review on site.
//for now, it is only geared towards sending data to airtable.

//we should only update games in AWS if images are changed, and in Mongo if the game is changed?
//I feel like I would be solving for scale for a relative non-issue at this time.
//like if we just pulled this data once daily, or created an airtable script that can push updates we'd be fine
//even if we made a simple hash of games of images and their last updates, we could quickly flag what games aren't in the hash and therefore what needs to be pushed
//save the hash locally so it persists
//would make this way way faster.

const gameLibrary = {};

module.exports.GameManager = {
  updateLibrary: async function (games) {
    const bulkOperations = [];

    const formattedGames = await Promise.all(games.map(gameAdapter));
    for (const rawGame of formattedGames) {
      if (rawGame instanceof FormattedGame) {
        bulkOperations.push({
          updateOne: {
            filter: { _id: rawGame._id },
            update: { ...rawGame },
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
