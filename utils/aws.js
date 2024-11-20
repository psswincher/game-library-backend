require("dotenv").config();
const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const https = require("https");

const s3Client = new S3Client({ region: process.env.AWS_REGION });

async function uploadImageFromAirtableToS3(game) {
  return new Promise((resolve, reject) => {
    console.log(`Fetching Image from URL: ${game.airtableImageUrl}`);

    https
      .get(game.airtableImageUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(
              `Airtable Image URL Bad Status Code: ${response.statusCode}`
            )
          );
          return;
        }

        const s3Params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: game._id,
          Body: response,
          ContentType: game.imageType,
          Metadata: { name: game.imageFileName },
        };

        const upload = new Upload({
          client: s3Client,
          params: s3Params,
        });

        upload
          .done()
          .then((data) => {
            resolve(data.Location);
          })
          .catch((err) => reject(new Error(`S3 Upload Error: ${err.message}`)));
      })
      .on("error", (err) => {
        reject(new Error(`Failed to get image from Airtable: ${err.message}`));
      });
  });
}

module.exports = { uploadImageFromAirtableToS3 };
