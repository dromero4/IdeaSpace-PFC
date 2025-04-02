import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";


const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socket = io('http://localhost:5000')
        setSocket(socket);

        return () => {
            socket.disconnect();
        }
    }, [])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext);