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

export function Topnavbar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Router>
                {/* Menu superior */}
                <nav className="flex items-center w-full h-15 bg-navbar-light shadow-md">
                    <Menu className="w-6 h-6 mx-5" onClick={() => setOpen(!open)} />
                    <Link to="/">
                        <Home className="w-6 h-6" />
                    </Link>
                    <div className='absolute right-0'>
                        <Link to="/login"><Button text={"Log in"} /></Link>
                        <Link to="/signup"><Button text={"Sign up"} /></Link>
                    </div>
                </nav>

                {open && <LeftNavbar setOpen={setOpen} />}

                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/articles" element={<Articles />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/friends" element={<Friends />} />
                    <Route path="/global-chat" element={<GChat />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/global-chat" element={<GChat />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>

            </Router>

        </>

    );
}
