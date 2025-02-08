// Get the client
import mysql from 'mysql2/promise';

const objconnection = {
    host: process.env.HOST,
    user: process.env.USERNAME,
    password:process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT,
    waitForConnections: true,
}
let db = mysql.createPool(objconnection);

export default db;