const router = require("express").Router();

const { RESOURCE_NOT_FOUND } = require("../utils/errors");
const { handleError } = require("../middlewares/errorHandler");

router.use((req, res) => {
  const error = new RESOURCE_NOT_FOUND(`Route not found: ${req.url}`);
  handleError(error, res);
});

module.exports = router;
