const mongoose = require("mongoose");
const validator = require("validator");

const gameScheme = new mongoose.Schema({
  _id: String,
  name: {
    type: String,
    min: 2,
    max: 30,
    required: true,
  },
  status: {
    type: String,
    enum: ["On Shelf"],
    required: true,
  },
  gameLength: {
    type: String,
    enum: ["20-30 Mins", "30-60 Mins", "1-2", "2+ hours"],
    required: true,
  },
  category: {
    type: String,
    enum: ["Competitive", "Cooperative", "Deception", "Social"],
    required: true,
  },
  playerCount: {
    type: [String],
    required: true,
    validate: {
      validator: function (value) {
        return value.length >= 1 && value.length <= 11;
      },
      message: "Players array must be between 1 and 11 entries",
    },
  },
  playerCountSlug: {
    type: String,
    min: 2,
    max: 20,
    required: true,
  },
  complexity: {
    type: String,
    enum: [
      "Lowest Complexity",
      "Lightweight",
      "Middleweight",
      "Heavyweight",
      "Top Complexity",
    ],
    required: true,
  },
  mechanics: {
    type: [String],
    required: true,
    validate: {
      validator: function (value) {
        return value.length >= 1 && value.length <= 5;
      },
      message: "Mechanics array must have between 1 and 5 entries.",
    },
  },
  fullDescription: {
    type: String,
    min: 2,
    max: 4000,
    required: true,
  },
  shortDescription: {
    type: String,
    min: 2,
    max: 150,
    required: true,
  },
  imageUrl: {
    type: String,
    min: 2,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    required: true,
  },
  isStrongArt: {
    type: Boolean,
    required: true,
  },
  isFeatured: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("game", gameScheme);
