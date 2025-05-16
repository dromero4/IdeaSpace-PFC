import { Home, Menu } from 'lucide-react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { Index } from '../pages/Index.jsx';
import { LeftNavbar } from './LeftNavbar.jsx';
import { useEffect, useState } from 'react';
import { Articles } from '../pages/Articles.jsx';
import { News } from '../pages/News.jsx';
import { Friends } from '../pages/Friends.jsx';
import { GChat } from '../pages/GChat.jsx';
import { Profile } from '../pages/Profile.jsx';
import { Button } from './button.jsx';
import { Login } from '../pages/Login.jsx';
import { Signup } from '../pages/Signup.jsx'

import { useAuth } from '../context/AuthContext.jsx';
import { ProtectedPage } from './protected/ProtectedPage.jsx';
import { Communities } from '../pages/Communities.jsx';

import '../CSS/styles.css';
import { useSocket } from '../context/SocketContext.jsx';

import Cookies from 'universal-cookie';
import { CreateArticle } from '../pages/CreateArticle.jsx';


export function Topnavbar() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const cookies = new Cookies();

    const { isLogged, setIsLogged } = useAuth();
    const socket = useSocket();

    let token = null;
    if (isLogged) token = cookies.get("access_login_token");



    useEffect(() => {
        if (socket) {
            // Verificar que socket no es null antes de usarlo
            socket.on("newNotification", (data) => {
                setNotifications((prevNotifications) => [
                    ...prevNotifications,
                    data.message,
                ]);
            });
        }
    }, [socket]);

    function showNotifications() {
        setNotifications([]); //de momento tengo que se borren, mas tarde añadiré mas
    }

    function handleLogout() {
        //enviar al server

        cookies.remove("access_login_token");
        setIsLogged(false);
        socket.emit("logout", { token });
        window.location.href = "/login";
    }

    return (
        <>
            <Router>
                {/* Menu superior */}
                <nav className="flex items-center w-full h-15 bg-navbar-light shadow-md">
                    {
                        isLogged && (
                            <Menu className="w-6 h-6 mx-3" onClick={() => setOpen(!open)} />
                        )
                    }

                    <Link to="/">
                        <Home className="w-6 h-6 mx-3" />
                    </Link>
                    {
                        !isLogged ? (
                            <div className="absolute right-0">
                                <Link to="/login"><Button text={"Log in"} /></Link>
                                <Link to="/signup"><Button text={"Sign up"} /></Link>
                            </div>
                        ) : (
                            <div className="absolute right-0 flex flex-row">
                                <div className="inbox-icon-container">
                                    <img src="./img/inbox.svg" alt="inbox" width={'60px'} height={'45px'} className="cursor-pointer" onClick={showNotifications} />
                                    {notifications.length > 0 && (
                                        <span className='notification-count'>{notifications.length}</span>
                                    )}
                                </div>
                                <Link to="/" onClick={handleLogout}>
                                    <Button text={"Log out"} />
                                </Link>
                            </div>

                        )
                    }


                </nav>

                {open && <LeftNavbar setOpen={setOpen} />}

                <Routes>
                    <Route path="/" element={
                        <Index />
                    } />

                    <Route path="/articles" element={
                        <ProtectedPage>
                            <Articles />
                        </ProtectedPage>
                    } />

                    <Route path="/news" element={
                        <ProtectedPage>
                            <News />
                        </ProtectedPage>} />

                    <Route path="/friends" element={<ProtectedPage><Friends /></ProtectedPage>} />

                    <Route path="/global-chat" element={<ProtectedPage><GChat /></ProtectedPage>} />

                    <Route path="/profile" element={
                        <ProtectedPage>

                            <Profile>

                            </Profile>
                        </ProtectedPage>}
                    />

                    <Route path="/global-chat" element={<ProtectedPage><GChat /></ProtectedPage>} />

                    <Route path="/communities" element={<ProtectedPage><Communities /></ProtectedPage>} />

                    <Route path="/login" element={<Login />} />

                    <Route path="/signup" element={<Signup />} />
                    <Route path="/create-article" element={<ProtectedPage><CreateArticle /></ProtectedPage>} />




                </Routes>

            </Router>

        </>

    );
}
