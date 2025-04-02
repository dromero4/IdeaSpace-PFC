import { Home, Menu } from 'lucide-react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Index } from '../pages/Index.jsx';
import { LeftNavbar } from './LeftNavbar.jsx';
import { useState } from 'react';
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


export function Topnavbar() {
    const [open, setOpen] = useState(false);

    const { isLogged, setIsLogged } = useAuth();


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
                            <div className="absolute right-0">
                                <Link to="/" onClick={() => setIsLogged(false)}><Button text={"Log out"} /></Link>
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

                    <Route path="/profile" element={<ProtectedPage><Profile /></ProtectedPage>} />

                    <Route path="/global-chat" element={<ProtectedPage><GChat /></ProtectedPage>} />

                    <Route path="/communities" element={<ProtectedPage><Communities /></ProtectedPage>} />

                    <Route path="/login" element={<Login />} />

                    <Route path="/signup" element={<Signup />} />




                </Routes>

            </Router>

        </>

    );
}
