const { Joi, celebrate } = require("celebrate");
const validator = require("validator");
const { weatherEnum } = require("../utils/config");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateUserEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// const validateWeatherEnum = (value, helpers) => {
//   if (weatherEnum.includes(value)) {
//     return value;
//   }
//   return helpers.error("string.uri");
// };


//TODO update to validate game
// module.exports.validateCreateClothingItem = celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().required().min(2).max(30),
//     imageUrl: Joi.string().required().custom(validateURL).messages({
//       "string.empty": 'The "imageUrl" field must be filled in',
//       "string.uri": 'the "imageUrl" field must be a valid url',
//     }),
//     weather: Joi.string().required().custom(validateWeatherEnum).messages({
//       "string.empty": 'The "weather" field must be selected',
//       "string.uri": 'the "weather" field must be a valid enum',
//     }),
//   }),
// });

module.exports.validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
    email: Joi.string().required().custom(validateUserEmail).messages({
      "string.empty": 'The "email" field must be filled in',
      "string.uri": 'the "email" field must be a valid email',
    }),
    password: Joi.string().required(),
  }),
});

module.exports.validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "email" field must be filled in',
      "string.uri": 'the "email" field must be a valid email',
    }),
    password: Joi.string().required(),
  }),
});

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().min(24).max(24),
  }),
});

module.exports.validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});
