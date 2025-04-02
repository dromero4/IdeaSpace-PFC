import { Home, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Options } from './navbar-options';


export function LeftNavbar({ setOpen }) {
    return (
        <aside className={`absolute top-0 h-full w-75 bg-navbar-light ${setOpen ? 'block' : 'hidden'}`}>
            <div className='flex flex-row justify-between m-6'>
                <Menu className="w-6 h-6" onClick={() => setOpen(false)} /> {/* Al hacer clic, cierra el menú */}
                <Link to="/" onClick={() => setOpen(false)}>
                    <Home className="w-6 h-6" />
                </Link>
            </div>

            <hr className='mx-5 opacity-25' />

            {/* top options */}
            <div className='flex flex-col'>
                <Link to='/articles' onClick={() => setOpen(false)}><Options svg={'./img/options-img/article.svg'} text={"Articles"} /></Link>
                <Link to='/news' onClick={() => setOpen(false)}><Options svg={'./img/options-img/news.svg'} text={"News"} /></Link>
                <Link to='/friends' onClick={() => setOpen(false)}><Options svg={'./img/options-img/friends.svg'} text={"Friends"} /></Link>
                <Link to='/global-chat' onClick={() => setOpen(false)}><Options svg={'./img/options-img/chat.svg'} text={"Global Chat"} /></Link>
                <Link to='/communities' onClick={() => setOpen(false)}><Options svg={'./img/options-img/communities.svg'} text={"Communities"} /></Link>
            </div>

            {/* bottom options*/}
            <div className='absolute bottom-0 mb-1 w-full'>
                <Link to='/profile' onClick={() => setOpen(false)}><Options svg={'./img/options-img/profile.svg'} text={"Profile"} /></Link>
                <Link to='/settings' onClick={() => setOpen(false)}><Options svg={'./img/options-img/settings.svg'} text={"Settings"} /></Link>
            </div>


        </aside>

    );
}
