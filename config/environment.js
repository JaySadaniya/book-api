
const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');
const morgan = require('morgan');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    assets_path: './assets',
    session_cookie_key: 'something',
    db: 'api_development',
    google_clientID: "89960730313-h1vmopt1f9me494di8cnijigrb9oqk1n.apps.googleusercontent.com",
    google_clientSecret: "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",
    google_callbackURL: "http://localhost:2000/users/auth/google/callback",
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}

const production = {
    name: 'production',
    assets_path: process.env.BOOKAPI_ASSETS_PATH,
    session_cookie_key: process.env.BOOKAPI_SESSION_COOKIE_KEY,
    db: process.env.BOOKAPI_DB,
    google_clientID: process.env.BOOKAPI_GOOGLE_CLIENT_ID,
    google_clientSecret: process.env.BOOKAPI_GOOGLE_CLIENT_SECRET,
    google_callbackURL: process.env.BOOKAPI_GOOGLE_CALLBACK_URL,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }

}

module.exports = eval(process.env.BOOKAPI_ENVIRONMENT) == undefined ? development : eval(process.env.BOOKAPI_ENVIRONMENT);