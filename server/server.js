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
import { isAuthenticated } from "./middlewares/isAuthenticated.js";
import { addLike, removeLike } from "./model/likes.js";
import { addPublication, getPublications } from "./model/publications.js";

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

const likesPerPublication = {};
// Evento de conexión de Socket.io
io.on("connection", (socket, req) => {
    socket.emit("message", {
        type: "init_likes",
        likes: likesPerPublication
    });

    //Eliminar el token de la cookie
    socket.on("logout", () => {
        socket.emit("message", {
            type: "logout",
            message: "Logout successful"
        });
        socket.disconnect();
        console.log("User disconnected");
        notifications.push(`${socket.username} has logged out`);
        socket.broadcast.emit("newNotification", { type: "logged_user", message: notifications[notifications.length - 1] });
    }
    );

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

                        const username = user.username;

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
            case "publication":
                const content = data.content;

                const token = data.token;
                const user = jwt.verify(token, process.env.SESSION_SECRET);


                console.log("Content:", content);
                console.log("User:", user);
                console.log("Username:", user.username);

                const date = new Date().toISOString().slice(0, 19).replace("T", " ");
                const likes = 0;
                const comments = 0;
                const username = user.username;

                if (content.length > 0) {
                    const id = await addPublication(connection, date, username, content, likes, comments);

                    socket.emit("message", {
                        type: "publication_successful",
                        message: "Publication successful",
                        publication: {
                            id,
                            date,
                            username,
                            content,
                            likes,
                            comments,
                            id
                        }
                    });

                }
                break;
            case "like":
                console.log(data);

                const id = data.id;

                if (data.like) {
                    addLike(connection, data.username, id);
                } else {
                    likesPerPublication[id] = Math.max(0, likesPerPublication[id] - 1);
                    removeLike(connection, data.username, id)
                }

                socket.broadcast.emit("newNotification", {
                    type: "like",
                    message: `${data.username} liked your post`
                });

                io.emit("message", {
                    type: "like",
                    n_likes: likesPerPublication[id],
                    id
                });

                break;
            case "get_all_publications":
                const publications = await getPublications(connection);

                console.log("Publications:", publications);
                socket.emit("message", {
                    type: "all_publications",
                    publications
                });
                break;
        }


    });


    socket.on("disconnect", () => {

    });
});

//endpoints
const articles = []; // Array para almacenar los artículos
app.get('/articles', isAuthenticated, res => res.status(401).json({ error: "Unauthorized" }));
app.get('/news', isAuthenticated);
app.get('/friends', isAuthenticated);
app.get('/global-chat', isAuthenticated);
app.get('/communities', isAuthenticated);
app.get('/profile', isAuthenticated);

// Iniciar servidor
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
