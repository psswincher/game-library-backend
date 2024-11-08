require("dotenv").config();
const AWS = require("aws-sdk");
const { PassThrough } = require('stream');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

export async function uploadImageFromAirtableToS3(airtableUrl, filename) {
    return new Promise((resolve, reject) => {
        https.get(airtableUrl, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to fetch image: ${response.statusCode}`));
                return;
            }

            const uploadStream = new PassThrough();
            const s3Params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: filename,
                Body: uploadStream,
                ContentType: response.headers['image/jpeg'],
                ACL: 'public-read' 
            };

            s3.upload(s3Params, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data.Location);
                }
            });

            response.pipe(uploadStream);
        }).on("error", (error) => {
            reject(error);
        });
    });
}