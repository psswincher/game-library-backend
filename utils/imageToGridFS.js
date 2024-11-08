const https = require("https");
const { GridFSBucket } = require("mongodb");
const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017";  // Replace with your MongoDB URI
const dbName = "gamelibrary_db";

let gfsBucket;

async function connectDB() {
    try {
        
        // await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await mongoose.connect(uri+"/"+dbName);
        const conn = mongoose.connection;
        conn.once("open", () => {
            gfsBucket = new GridFSBucket(conn.db, { bucketName: "images" });
            console.log("Connected to MongoDB and initialized GridFS");
        });
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

function getGfsBucket() {
    if (!gfsBucket) {
        throw new Error("GridFSBucket is not initialized");
    }
    return gfsBucket;
}

async function uploadImageToGridFS(url, filename) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            const uploadStream = gfsBucket.openUploadStream(filename);
            
            response
                .pipe(uploadStream)
                .on("error", (error) => reject(error))
                .on("finish", () => resolve(uploadStream.id));
        }).on("error", (error) => {
            console.error("Error fetching image:", error);
            reject(error);
        });
    });
}

module.exports = {uploadImageToGridFS, connectDB, getGfsBucket }