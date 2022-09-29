/** Database setup for BizTime. */
const { Client } = require('pg');

let DB_URI;

if (process.env.NODE_ENV === "test") {
    DB_URI = "postgresql:///biztime_test";
} else {
    DB_URI = "postgresql:///biztime";
    //DB_URI = "psql://fiona:0215@localhost:5432/biztime"
}

let db = new Client({
    connectionString: DB_URI
});

db.connect();

module.exports = db;
