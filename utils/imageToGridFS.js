const https = require("https");
const { GridFSBucket } = require("mongodb");
const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017";  // Replace with your MongoDB URI
const dbName = "gamelibrary_db";


async function uploadImageToGridFS(url, filename, gfsBucket) {
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

module.exports = { uploadImageToGridFS }