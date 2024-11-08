//game manager is a singleton class that 

const { gameAdapter, FormattedGame } = require("./GameAdapter");
const Game = require("../models/game");
const { uploadImageToGridFS } = require("./imageToGridFS");

module.exports.GameManager = {

    updateLibrary: async function(games) {
        const bulkOperations = [];
        const count = await Game.countDocuments();
        console.log(`Connected to: ${Game.db.host}:${Game.db.port}`);
console.log(`Document count before bulkWrite: ${count}`);
        for (const rawGame of games) {
            //should we bother formatting the game into a useable object 
            let game = gameAdapter(rawGame);
            
            if(game instanceof FormattedGame) {
                console.log(game);

                if (game.imageUrl) {
                    const fileId = await uploadImageToGridFS(game.imageUrl, game.recordId);
                    game.imageFileId = fileId;
                }

                bulkOperations.push({
                    updateOne: {
                        filter: {_id: game._id},
                        update: {...game},
                        upsert: true
                    }
                });
        }
        };
        console.log("Bulk operations:", bulkOperations);
        
        try {
            const result = await Game.bulkWrite(bulkOperations);
            console.log("BulkWrite Result:", result);
        } catch (error) {
            console.error("BulkWrite Error:", error);
        }
    }
}