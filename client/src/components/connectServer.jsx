import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import App from "../App.jsx";

export function ServerConnection() {
    const socketRef = useRef(null); // Usar useRef para almacenar el socket

    useEffect(() => {
        // Conectar al servidor solo una vez
        socketRef.current = io("http://localhost:5000");

        // Conectar al servidor
        socketRef.current.on("connect", () => {
            console.log(`Conectado al servidor con ID: ${socketRef.current.id}`);
        });

        socketRef.current.on("disconnect", () => {
            console.log("Desconectado del servidor");
        });

        // Limpiar los eventos cuando el componente se desmonta
        return () => {
            socketRef.current.off("connect");
            socketRef.current.off("disconnect");
            socketRef.current.disconnect(); // Desconectar al desmontar el componente
        };
    }, []);

    return <App />;
}
