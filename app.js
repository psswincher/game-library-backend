const express = require("express");
const mongoose = require("mongoose");
const {connectDB } = require("./utils/imageToGridFS");
// const cors = require("cors");
const bodyParser = require("body-parser");
// const { errors } = require("celebrate");
require("dotenv").config();
// const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
// const { defineBackend } = require("@aws-amplify/backend");
const {airtable} = require("./utils/airtableApi");
const {GameManager} = require("./utils/gameLibrary");

connectDB();
airtable.fetchTableRecords("tblw2Gr10ycjHuk5N").then((res) => {
  // console.log(res)
  GameManager.updateLibrary(res);
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

// const { requestLogger, errorLogger } = require("./middlewares/logger");
const mainRouter = require("./routes/index");
const { errorHandler } = require("./middlewares/errorHandler");

const { PORT = 3001 } = process.env;

const app = express();
// mongoose.connect("mongodb://127.0.0.1:27017/gamelibrary_db");
// app.use(cors());
// app.use(helmet());

app.use(limiter);
// app.use(requestLogger);

app.use(bodyParser.json());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use("/", mainRouter);

// app.use(errorLogger);
// app.use(errors());
// app.use("/", errorHandler);

app.listen(PORT);
