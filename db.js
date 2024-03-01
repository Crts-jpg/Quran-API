const { Pool } = require('pg');

const pool = new Pool({
    user: 'admin',
    password: 'admin123456',
    host: 'localhost',
    port: 5432, //default port
    database: 'alquran_db'
});

module.exports = {
    query: (text, params) => pool.query(text, params)
};
