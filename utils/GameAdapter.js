//GameAdapter takes Airtable's base json export and makes each record into a GameAdapter instance
//If for some reason our user's backend interface ever changed from airtable, we could update this without having to overhaul anything else
const gameAdapter = function (game) {
  if (
    game.id &&
    game.fields["Shelf Status"] &&
    game.fields["Categories"] &&
    game.fields["Game Image"] &&
    game.fields["Shelf Status"] === "On Shelf"
  ) {
    return new FormattedGame(game);
  } else {
    console.log("Invalid game provided to adapter, game skipped.");
    console.log(game.Name);
    return null;
  }
};

class FormattedGame {
  constructor(game) {
    this.gameLength = game.fields["Game Length"];
    this.title = game.fields.Name;
    this._id = game.id;
    this.category = game.fields["Categories"];
    this.status = game.fields["Shelf Status"];
    this.weight = game.fields["Vig Weight"];
    this.fullDescription = game.fields.Description;
    this.shortDescription = game.fields.Description_Slug;
    this.rating = game.fields.rating;
    this.airtableImageUrl = game.fields["Game Image"][0].url;
    this.imageFileName = game.fields["Game Image"][0].filename;
    this.imageType = game.fields["Game Image"][0].type;
    this._id + "_" + this.airtableImageId;
    console.log(this);
  }
}

module.exports = { gameAdapter, FormattedGame };
