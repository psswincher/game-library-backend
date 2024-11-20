//GameAdapter takes Airtable's base json export and makes each record into a GameAdapter instance
//If for some reason our user's backend interface ever changed from airtable, we could update this without having to overhaul anything else
const { uploadImageFromAirtableToS3 } = require("./aws");

const gameAdapter = async function (game) {
  // console.log(game);
  if (
    game.id &&
    game.fields["Shelf Status"] &&
    game.fields["Categories"] &&
    game.fields["Game Image"] &&
    game.fields["Shelf Status"] === "On Shelf"
  ) {
    const formattedGame = new FormattedGame(game);

    try {
      formattedGame.imageUrl = await uploadImageFromAirtableToS3(formattedGame);
      return formattedGame;
    } catch (err) {
      console.log("Image upload failed:", err);
      return null;
    }
  } else {
    console.log("Invalid game provided to adapter, game skipped.");
    return null;
  }
};

class FormattedGame {
  constructor(game) {
    this._id = game.id;
    this.name = game.fields.Name;
    this.status = game.fields["Shelf Status"];

    this.gameLength = game.fields["Game Length Web Slug"];
    this.category = game.fields["Categories"];
    this.playerCount = game.fields.Players;
    this.playerCountSlug = game.fields["PlayerCount_Slug"];
    this.complexity = game.fields["Game Complexity"];

    this.mechanics = game.fields.Mechanics;

    this.fullDescription = game.fields.Description;
    this.shortDescription = game.fields["Short description"];

    this.airtableImageUrl = game.fields["Game Image"][0].url;
    this.imageFileName = game.fields["Game Image"][0].filename;
    this.imageType = game.fields["Game Image"][0].type;
    this._id + "_" + this.airtableImageId;
    // console.log(this);
  }
}

module.exports = { gameAdapter, FormattedGame };
