const { JWT_SECRET = "MyVerySecretKey" } = process.env;

const weatherEnum = ["hot", "cold", "warm"];

const gameLibraryView = "Website Library Online";

module.exports = {
  JWT_SECRET,
  weatherEnum,
  gameLibraryView,
};
