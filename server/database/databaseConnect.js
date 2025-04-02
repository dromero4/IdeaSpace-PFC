import mysql from 'mysql2/promise';  // Usamos mysql2 con promesas
import dotenv from 'dotenv';

dotenv.config();

export async function createDatabaseConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        console.log("Database connection successful");
        return connection;
    } catch (err) {
        console.error("There was a problem connecting to the database.", err);
        throw err; // Lanzamos el error si ocurre
    }
}
