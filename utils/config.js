const { JWT_SECRET = "MyVerySecretKey" } = process.env;

const weatherEnum = ["hot", "cold", "warm"];

module.exports = {
  JWT_SECRET,
  weatherEnum,
};
