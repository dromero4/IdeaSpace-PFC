import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import { configDotenv } from "dotenv";

import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

import { createDatabaseConnection } from './database/databaseConnect.js';
import { verifyInputs, addUser, isUserExisting, isUsernameRepeated, login, getInformation } from "./model/users.js";

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



app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Ajusta según tu frontend
app.use(express.json());


// ========================
// Esperar a que la conexión se resuelva
const connection = await createDatabaseConnection();


const notifications = [];

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
        return res.status(400).send({ message: "There was an error validating the inputs", errors });
    }

    // Verificar si el usuario ya existe en la base de datos
    try {
        const userExists = await isUserExisting(connection, email);
        if (userExists) {
            return res.status(400).json({ message: `There is already an account linked to ${email}` });
        }
    } catch (error) {
        console.error('Error al verificar si el usuario existe:', error);
        return res.status(500).json({ message: "There was an error verifying the user", errors: error });
    }

    try {
        const repeatedUsername = await isUsernameRepeated(connection, username);

        if (repeatedUsername) {
            return res.status(400).json({ message: "That username already exists, try another one..." });
        }
    } catch (error) {
        console.error('El nombre de usuario ya existe');
        return res.status(500).json({ message: "There was a unexpected problem" }, error);
    }

    // Si no hay errores, se realiza el hash de la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertar al usuario en la base de datos
    try {
        const userAdded = await addUser(connection, name, username, birthdate, email, hashedPassword, signup_date);

        if (userAdded) return res.status(201).json({ message: "User added successfuly" });

    } catch (error) {
        return res.status(500).json({ message: "There was an error adding the user...", error });
    }

    console.log("Usuario agregado a la base de datos correctamente")
    return res.status(201).json({ message: "User registered successfully", id: result.insertId });
});

// ========================

// Evento de conexión de Socket.io
io.on("connection", (socket) => {
    socket.on('message', async data => {
        const type = data.type;

        switch (type) {
            case "user_login":
                try {
                    const { username, password } = data;

                    const user = await getInformation(connection, username);

                    if (!username || !password) {
                        return socket.emit("error", { type: "missing_credentials", message: "Please enter your credentials" });
                    }

                    const logged = await login(connection, username, password);

                    console.log("Logged:", logged);
                    console.log(username, password);

                    if (logged) {
                        const token = jwt.sign(
                            { username: user.username, email: user.email },
                            process.env.SESSION_SECRET,
                            { expiresIn: "1h" }
                        );

                        socket.emit("message", { type: "login_successful", message: "Login successful", token, logged });

                        //notifications.push
                        notifications.push(`${username} has logged in`);
                        socket.broadcast.emit("newNotification", { type: "logged_user", message: notifications[notifications.length - 1] });

                    } else {
                        socket.emit("message", { type: "login_incorrect", message: "Incorrect username or password", logged });
                    }

                } catch (error) {
                    console.error("Error in login process:", error);
                    socket.emit("error", { type: "server_error", message: "An error occurred during login" });
                }
                break;
            //more cases
        }
    });


    socket.on("disconnect", () => {
    });
});

// Iniciar servidor
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
