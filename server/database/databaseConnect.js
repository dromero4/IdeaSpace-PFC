import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

export const database = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

database.connect(err => {
    if (err) {
        console.error("There was a problem connecting to the database.");
        return;
    }

    console.log("Database connection successful");
});