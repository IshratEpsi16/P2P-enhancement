const oracledb = require("oracledb");
require('dotenv').config();


// This is for single connect
const connectionP2P = {
    user: process.env.DB_USER,
    password: process.env.SECRET_KEY,
    connectString: process.env.DATABASE_URL
};


// This is for pool connect
const connectionP2PPool = {
    user: process.env.DB_USER,
    password: process.env.SECRET_KEY,
    connectString: process.env.DATABASE_URL
};


async function getGeneral() {
    try {
        const connection = await oracledb.getConnection(connectionP2P);
        return connection;
    } catch (err) {
        console.error('Error creating connection pool:', err);
        throw err;
    }
}


async function getPool() {
    try {
        const pool = await oracledb.createPool(connectionP2PPool);
        let poolConnect = await pool.getConnection();

        return poolConnect;
    } catch (err) {
        console.error('Error creating connection pool:', err);
        throw err;
    }
}


module.exports = {
    getPool,
    getGeneral
}