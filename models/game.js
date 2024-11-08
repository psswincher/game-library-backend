const mongoose = require("mongoose");
const validator = require("validator");

const gameScheme = new mongoose.Schema({
  _id: String,
    gameLength: {
    type: String,
    enum: ["Short (~15 Mins)", "Medium (~45 Mins)","Long (1-2 Hours)","Epic (2+ hours)"],
    required: true
  },
  title: {
    type: String,
    min: 2,
    max: 30,
    required: true
  },
  category: {
    type: String,
    enum: ["Competitive", "Cooperative", "Deception","Social"],
    required: true,
  },
  status: {
    type: String,
    enum: ["On Shelf"],
    required: true,
  },
  weight: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    required: true,
  },
  fullDescription: {
    type: String,
    min: 2,
    required: true,
  },
  shortDescription: {
    type: String,
    min: 2,
    max: 400,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    required: true,
  },

  imageFileId: { type: mongoose.Schema.Types.ObjectId, ref: "fs.files", required: true } 
});

module.exports = mongoose.model("game", gameScheme);