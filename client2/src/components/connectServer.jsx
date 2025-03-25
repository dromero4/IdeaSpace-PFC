import React, { useEffect } from "react";
import { io } from "socket.io-client";
import App from "../App.jsx";



export function ServerConnection() {
    const socket = io("http://localhost:5000"); // Conectar al servidor
    useEffect(() => {
        socket.on("connect", () => {
            console.log(`Conectado al servidor con ID: ${socket.id}`);
        });

        socket.on("disconnect", () => {
            console.log("Desconectado del servidor");
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
        };
    }, []);

    return <App />;
}