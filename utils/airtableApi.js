const Airtable = require('airtable');

class AirtableAPI {
    constructor({baseId}) {
        // this._baseUrl = 'http://api.airtable.com/v0';
        this._baseId = baseId;
        Airtable.configure({
            endpointUrl: 'https://api.airtable.com',
            apiKey: 'patlHvHC6cTgXzbkX.f7dd13204854ec51e8bf6aa14b02be312ac3c672418a9b0d4644c96ce16b05db'
        });
        this._base = Airtable.base(this._baseId);
    }

    fetchTableRecords(tableId) {
        let records = [];
        return new Promise((resolve, reject) => {
            this._base(tableId).select({maxRecords: 3}).eachPage((pageRecords, fetchNextPage) => {
                records = records.concat(pageRecords)
                fetchNextPage();}, (error) => {
                error ? reject(error) : resolve(records) }
                );
        });    
    }

    
        
    }

module.exports.airtable = new AirtableAPI({baseId: 'appWhFvxIlwhphrOL'});