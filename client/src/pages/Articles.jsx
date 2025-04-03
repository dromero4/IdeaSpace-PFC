import { useNavigate } from "react-router-dom";
import { Header } from "../components/header";
import { useEffect } from "react";

import Cookies from 'universal-cookie';

export function Articles() {
    const navigate = useNavigate();

    const cookies = new Cookies();
    const token = cookies.get('access_login_token');


    useEffect(() => {
        fetch('http://localhost:5000/articles', {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        }).then(res => {
            if (res.status === 401) navigate('/');
            return res.json();
        }).then(data => {
            if (data) console.log("Articles");
        })
    }, [])

    return (
        <Header text={"Articles"} />
    )
}