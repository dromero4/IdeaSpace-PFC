import { MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useEffect } from "react";

import Cookies from 'universal-cookie';

export function Publication({ publicationID, profile_img, content, date, likes, comments, username }) {
    const [like, setLike] = useState(true);
    const [n_likes, set_n_likes] = useState(likes);

    const socket = useSocket();

    const cookies = new Cookies();
    const token = cookies.get('access_login_token');

    function handleClick() {
        setLike(!like);
        socket.emit("message", { type: "like", id: publicationID, username, like, n_likes, token });
    }

    useEffect(() => {
        if (!socket) return;

        const handler = (data) => {
            if (data.type === "like" && data.id === publicationID) {
                set_n_likes(data.n_likes);
            }

            if (data.type === "init_likes" && data.likes[publicationID] !== undefined) {
                set_n_likes(data.likes[publicationID]);
            }
        };

        socket.on("message", handler);

        return () => {
            socket.off("message", handler); // Limpieza
        };
    }, [socket, publicationID]);



    return (
        <>
            <hr className="opacity-25 ml-5" />
            {publicationID}
            <section className="m-5 p-2 w-[50%] bg-gray-300 opacity-75 rounded-lg text-black">
                <div className="relative flex flex-row">
                    <section className="rounded-full bg-black w-10 h-10"></section>
                    <section className="flex-1 ml-2 flex items-center">
                        @{username}
                    </section>
                    <aside className="absolute right-0">{date}</aside>
                </div>

                <section className="p-2">
                    {content}
                </section>

                <footer className="flex flex-row gap-2">
                    {n_likes}
                    {like ? (
                        <ThumbsUp className="text-gray-500 cursor-pointer" onClick={handleClick} />
                    ) : (
                        <ThumbsUp className="text-blue-600 cursor-pointer" onClick={handleClick} />
                    )}

                    {comments}
                    <MessageCircle className="text-gray-600" />


                </footer>
            </section>

        </>
    )
}