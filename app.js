const express = require("express");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const { errors } = require("celebrate");
require("dotenv").config();
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");

const { airtable } = require("./utils/airtableApi");
const { GameManager } = require("./utils/gameLibrary");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const mainRouter = require("./routes/index");
const { errorHandler } = require("./middlewares/errorHandler");

const { PORT = 3001 } = process.env;

const app = express();

// === Setup Middleware ===
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
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);
app.use(bodyParser.json());
app.use(requestLogger);

// === Dev Crash Route ===
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// === Initialize Mongo and GridFS ===
let gfsBucket;
mongoose.connect("mongodb://127.0.0.1:27017/gamelibrary_db");
const mongoConnection = mongoose.connection;

mongoConnection.once("open", async () => {
  console.log("MongoDB connected");
  gfsBucket = new GridFSBucket(mongoConnection.db, { bucketName: "images" });

  try {
    const records = await airtable.fetchTableRecords("tblw2Gr10ycjHuk5N");
    await GameManager.updateLibrary(records, gfsBucket);
    console.log("Initial library sync complete.");
  } catch (err) {
    console.error("Initial Airtable sync failed:", err);
  }
});

// === Airtable Webhook Route (always registered) ===
app.post("/api/webhook/airtable", async (req, res) => {
  console.log("airtable hook received");
  try {
    const receivedSecret = req.header("x-webhook-secret");
    if (receivedSecret !== process.env.AIRTABLE_WEBHOOK_SECRET) {
      return res.status(401).send("Unauthorized");
    }

    if (!gfsBucket) {
      return res.status(503).send("GridFS not initialized yet");
    }

    const records = await airtable.fetchTableRecords("tblw2Gr10ycjHuk5N");
    await GameManager.updateLibrary(records, gfsBucket);
    console.log("airtable hook processed");
    res.status(200).send("Webhook received and processed");
  } catch (err) {
    console.error("Error handling Airtable webhook:", err);
    res.status(500).send("Internal Server Error");
  }
});

// === Register Main App Routes ===
app.use("/", mainRouter);

// === Error Handling ===
app.use(errorLogger);
app.use(errors());
app.use("/", errorHandler);

// === Start Server ===
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
