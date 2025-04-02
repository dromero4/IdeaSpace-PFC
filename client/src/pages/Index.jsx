import { useEffect } from 'react';
import { Header } from '../components/header'
import { useSocket } from '../context/SocketContext';


export function Index() {
    const socket = useSocket();

    useEffect(() => {
        if (socket) {
            socket.on("message", data => {
                const type = data.type;

                switch (type) {
                    case "logged_user":
                        alert(data.message);
                        break;
                }
            })

            socket.on("error", data => {
                const type = data.type;

                switch (type) {
                    case "missing_credentials":
                        showToast(data.message, "error");
                        break;
                }
            })
        }


    }, [socket])
    return (
        <>
            <Header text={"Index"} />
        </>
    )
}