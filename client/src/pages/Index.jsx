import { useEffect, useState } from 'react';
import { Header } from '../components/header'
import { useSocket } from '../context/SocketContext';

import Cookies from 'universal-cookie';

import '../CSS/styles.css';
import { Publication } from '../components/publication';
import { Send } from 'lucide-react';

export function Index() {
    const socket = useSocket();

    const cookies = new Cookies();
    const token = cookies.get('access_login_token');

    const [characters_left, setCharacters_left] = useState(255);

    const [publications, setPublications] = useState([]);

    useEffect(() => {
        if (!socket) return;
        socket.emit("get_all_publications", { token });

        const handleAllPublications = (data) => {
            if (data.type === "all_publications") {
                setPublications(data.publications);
            }
        }

        socket.on("message", handleAllPublications);

        const handleMessage = (data) => {
            const type = data.type;

            switch (type) {
                case "logged_user":
                    alert(data.message);
                    break;
                case "publication_successful":
                    if (data.publication) {
                        setPublications((prev) => [
                            data.publication,
                            ...prev,
                        ]);

                    } else {
                        alert("Error: No se pudo obtener la publicación.");
                    }
                    break;
            }
        };

        const handleError = (data) => {
            const type = data.type;
            if (type === "missing_credentials") {
                showToast(data.message, "error");
            }
        };

        socket.on("message", handleMessage);
        socket.on("error", handleError);

        // Limpieza
        return () => {
            socket.off("message", handleMessage);
            socket.off("error", handleError);
            socket.off("message", handleAllPublications);
        };
    }, [socket]);


    function handleChange(event) {
        if (event.target.value.length <= 255) {
            setCharacters_left(255 - event.target.value.length);
        }
    }

    function handleClick() {
        const textarea = document.getElementById('textarea');
        const content = textarea.value;

        if (content.length > 0) {
            socket.emit("message", { type: "publication", content, token });
            textarea.value = "";
            setCharacters_left(255);
        } else {
            alert("Please write something before publish.");
        }
    }


    return (
        <>
            <Header text={"Index"} />
            {
                token ?
                    <section className='parent'>
                        <article className='div1'>
                            <section className="relative w-[70%] h-auto bg-gray-200 m-5 rounded-lg p-4 flex flex-row">
                                {/* profile image prueba*/}
                                <aside className='mb-2 mr-4 bg-gray-300 w-25 h-25 rounded-full'></aside>
                                <section className='flex-1 h-auto'>

                                    <div className='opacity-50'>{characters_left}</div>
                                    <div className="bg-white rounded-md p-2 w-full h-auto">
                                        <textarea id='textarea'
                                            onChange={handleChange}
                                            maxLength={255}
                                            className="rounded-md p-2 w-full h-24 text-sm text-left align-top resize-none"
                                            placeholder="What are you thinking about today? Why don't you share it with your followers?"
                                        ></textarea>
                                    </div>
                                    <button onClick={handleClick} className='bg-gray-400 text-white rounded-md p-1 mt-2 w-full h-auto flex justify-center items-center 
                                    hover:bg-gray-500 transition duration-200 ease-in-out cursor-pointer'>

                                        <Send />
                                    </button>
                                </section>
                            </section>

                            <section className='flex flex-col p-4 opacity-50'>
                                {publications.length === 0 ? (
                                    <p>No hay publicaciones para mostrar.</p>
                                ) : (
                                    publications.map((post) => (
                                        <Publication
                                            key={post.id}
                                            publicationID={post.id}
                                            title={post.title}
                                            username={post.username}
                                            content={post.content}
                                            date={post.date}
                                            likes={post.likes}
                                            comments={post.comments}
                                        />
                                    ))

                                )}
                            </section>

                        </article>
                        <article className='div2'></article>
                        <article className='div3'></article>
                        <aside className='div4'></aside>
                    </section>



                    //Not logged in
                    :
                    <section className="">

                    </section>
            }
        </>
    )
}