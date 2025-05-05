const express = require("express");
const { mongoose } = require("mongoose");
const { GridFSBucket } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const { errors } = require("celebrate");
require("dotenv").config();
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
// const { defineBackend } = require("@aws-amplify/backend");
const { airtable } = require("./utils/airtableApi");
const { GameManager } = require("./utils/gameLibrary");

//set up mongodb and establish gridFS connection to store images
let gfsBucket;
mongoose.connect("mongodb://127.0.0.1:27017/gamelibrary_db");
const mongoConnection = mongoose.connection;

// mongoConnection.once("open", () => {
//   gfsBucket = new GridFSBucket(mongoConnection.db, { bucketName: "images" });
//   airtable.fetchTableRecords("tblw2Gr10ycjHuk5N").then((res) => {
//     GameManager.updateLibrary(res, gfsBucket);
//   });
// });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

const { requestLogger, errorLogger } = require("./middlewares/logger");
const mainRouter = require("./routes/index");
const { errorHandler } = require("./middlewares/errorHandler");

const { PORT = 3001 } = process.env;

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "https://www.vigilantebarlibary.com",
      "https://vigilantebarlibrary.com",
    ],
  })
);
app.use(helmet());

app.use(limiter);
app.use(bodyParser.json());
app.use(requestLogger);

// app.use((req, res, next) => {
//   console.log({
//     method: req.method,
//     url: req.originalUrl,
//     headers: req.headers,
//     body: req.body, // Ensure the body is available after parsing
//   });
//   next();
// });

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use("/", mainRouter);

mongoConnection.once("open", () => {
  gfsBucket = new GridFSBucket(mongoConnection.db, { bucketName: "images" });

  // Optional: Initial sync
  airtable.fetchTableRecords("tblw2Gr10ycjHuk5N").then((res) => {
    GameManager.updateLibrary(res, gfsBucket);
  });

  // Airtable Webhook
  app.post("/api/webhook/airtable", async (req, res) => {
    console.log("airtable hook received");
    try {
      const receivedSecret = req.header("x-webhook-secret");
      if (receivedSecret !== process.env.AIRTABLE_WEBHOOK_SECRET) {
        return res.status(401).send("Unauthorized");
      }
      console.log("airtable hook processed");
      const records = await airtable.fetchTableRecords("tblw2Gr10ycjHuk5N");
      await GameManager.updateLibrary(records, gfsBucket);
      res.status(200).send("Webhook received and processed");
    } catch (err) {
      console.error("Error handling Airtable webhook:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

app.use(errorLogger);
app.use(errors());
app.use("/", errorHandler);

app.listen(PORT);
