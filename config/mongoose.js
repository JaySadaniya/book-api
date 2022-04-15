const env = require('./environment');

// creating and exporting database

const mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost/${env.db}`);

const db = mongoose.connection;

db.on('error', (err) => console.log(err.message) );

db.once('open', () => console.log('Successfully connected to database') );


module.exports = db;