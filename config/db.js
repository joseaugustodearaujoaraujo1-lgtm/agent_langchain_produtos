import "dotenv/config"
import mysql2 from "mysql2/promise"

const pool = mysql2.createPool({
    user: process.env.DB_USER ,
    port: process.env.DB_PORTA ,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD ,
    host: process.env.DB_HOST ,
    waitForConnections: true,
    connectionLimit: 10
})

export default pool
