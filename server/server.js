import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import { configDotenv } from "dotenv";

import { md5 } from 'js-md5';

import { database } from './database/databaseConnect.js';
import { verifyInputs, addUser, isUserExisting, isUsernameRepeated } from "./model/users.js";

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

app.post('/signup', async (req, res) => {
    const data = req.body;

    const name = data.name;
    const username = data.username;
    const email = data.email;
    const password = data.password;
    const confirmPassword = data.confirmPassword;
    const birthdate = data.date;
    const signup_date = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Verificar los datos de entrada
    const errors = verifyInputs(name, username, password, confirmPassword, email, birthdate, signup_date);
    if (errors.length > 0) {
        return res.status(400).send({ message: "Error de validación", errors });
    }

    // Verificar si el usuario ya existe en la base de datos
    try {
        const userExists = await isUserExisting(database, email); // Usamos la función isUserExisting
        if (userExists) {
            return res.status(400).json({ message: `There is already an account linked to ${email}` });
        }
    } catch (error) {
        console.error('Error al verificar si el usuario existe:', error);
        return res.status(500).json({ message: "Hubo un error al verificar el usuario" });
    }

    try {
        const repeatedUsername = await isUsernameRepeated(database, username);

        if (repeatedUsername) {
            return res.status(400).json({ message: "That username already exists, try another one..." });
        }
    } catch (error) {
        console.error('El nombre de usuario ya existe');
        return res.status(500).json({ message: "There was a unexpected problem" }, error);
    }

    // Si no hay errores, se realiza el hash de la contraseña
    const hashedPassword = md5(password);
    console.log(hashedPassword);

    // Insertar al usuario en la base de datos
    addUser(database, name, username, birthdate, email, hashedPassword, signup_date, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "There was an error adding the user...", err });
        }

        console.log("Usuario agregado a la base de datos correctamente")
        res.status(201).json({ message: "User registered successfully", id: result.insertId });
    });
});


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
