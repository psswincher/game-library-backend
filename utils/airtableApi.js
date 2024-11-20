const Airtable = require("airtable");
require("dotenv").config();
const { gameLibraryView } = require("./config");

//TODO we really should only be fetching records that have an update that is more recent than the most recent pull
// .select() does take a filter method. maybe we could store the last fetch date here in the backend
// create a 'last modified' field in airtable that only watches fields pertinent to the site
// and then filter based on that? can't wait to build a filter that works with dates /s

class AirtableAPI {
  constructor({ baseId, airtableAccessKey }) {
    this._baseId = baseId;
    Airtable.configure({
      endpointUrl: "https://api.airtable.com",
      apiKey: airtableAccessKey,
    });
    this._base = Airtable.base(this._baseId);
  }

  fetchTableRecords(tableId) {
    let records = [];
    return new Promise((resolve, reject) => {
      this._base(tableId)
        .select({ view: gameLibraryView })
        .eachPage(
          (pageRecords, fetchNextPage) => {
            records = records.concat(pageRecords);
            fetchNextPage();
          },
          (error) => {
            error ? reject(error) : resolve(records);
          }
        );
    });
  }
}

module.exports.airtable = new AirtableAPI({
  baseId: process.env.AIRTABLE_BASE_ID,
  airtableAccessKey: process.env.AIRTABLE_ACCESS_KEY,
});
