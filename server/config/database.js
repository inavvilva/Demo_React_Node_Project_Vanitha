var mysql = require('mysql');
var config = require('./config');
var util =  require('util');

var pool = mysql.createPool({
    connectionLimit: 100,
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName
});

pool.getConnection((err, connection) => {
    if(err) {
        if(err.code === 'PROTOCOL_cONNECTION_LOST') {
             console.log("Database connection was closed");
        }
        if(err.code === 'ER_CON_COUNT_ERROR') {
            console.log("Database has too many connections.");
        }
        if(err.code === 'ECONNREFUSED') {
            console.log("Database connection was refused.");
        }
        if(connection){
            connection.release();
        }
        return;
    }
});

pool.query = util.promisify(pool.query);

module.exports = pool;