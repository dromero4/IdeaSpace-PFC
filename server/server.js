import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import { configDotenv } from "dotenv";

import { database } from './database/databaseConnect.js';
import { verifyInputs, addUser } from "./model/users.js";

// Obtener el directorio actual (para módulos ES)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Cargar las variables de entorno desde el archivo .env
configDotenv({ path: path.join(__dirname, '.env') });

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Permitir conexiones desde cualquier origen (ajustar en producción)
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// ========================

app.post('/login', (req, res) => {
    const data = req.body;

    console.log(data);
    res.send({ message: "Recibido servidor" });
});

app.post('/signup', (req, res) => {
    try {
        const errors = verifyInputs(form.username, form.email, form.password, form.date, form.name);
        if (errors.length > 0) {
            res.status(400).send({ message: "Error en los campos", errors });
            return;
        }

        const data = req.body;

        const name = data.name;
        const username = data.username;
        const email = data.email;
        const password = data.password;
        const birthdate = data.date;
        const signup_date = new Date().toISOString().slice(0, 19).replace("T", " ");

        addUser(database, name, username, birthdate, email, password, signup_date, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "There was an error adding the user...", error: err });
            }

            res.status(201).json({ message: "User registered successfully", id: result.insertId });
            console.log("User registered successfully");
        })
    } catch (error) {
        res.status(400).json({ error });
    }
})

// ========================

// Evento de conexión de Socket.io
io.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});

// Iniciar servidor
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
