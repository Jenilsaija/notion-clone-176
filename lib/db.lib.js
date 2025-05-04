// Get the client
import mysql from 'mysql2/promise';

const objconnection = {
    host: process.env.NEXT_PUBLIC_HOST,
    user: process.env.NEXT_PUBLIC_USERNAME,
    password:process.env.NEXT_PUBLIC_PASSWORD,
    database: process.env.NEXT_PUBLIC_DATABASE,
    port: process.env.NEXT_PUBLIC_PORT,
    waitForConnections: true,
}
let db = mysql.createPool(objconnection);

export default db;