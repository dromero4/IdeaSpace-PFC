import { useNavigate } from 'react-router-dom'
import { Header } from '../components/header'
import { useEffect } from 'react';

export function Profile({ user = '[user]' }) {
    const navigate = useNavigate();


    // useEffect(() => {
    //     fetch('http://localhost:5000/profile', {
    //         method: "GET",
    //         headers: {
    //             "Authorization": `Bearer ${token}`,
    //         }
    //     })
    // }, [])
    return (
        <Header text={`Howdy, ${user}`} svg={"./img/wave.svg"} />
    )
}