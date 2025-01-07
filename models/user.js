const validator = require("validator");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { INVALID_LOGIN } = require("../utils/errors");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  likedGames: {
    type: [String],
    required: true,
  },
  playedGames: {
    type: [String],
    required: true,
  },
  wantedGames: {
    type: [String],
    required: true,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials({
  email,
  password,
}) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new INVALID_LOGIN("Incorrect password or email"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new INVALID_LOGIN("Incorrect password or email")
          );
        }
        return user;
      });
    });
};

userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("user", userSchema);
