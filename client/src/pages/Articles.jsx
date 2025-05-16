import { useNavigate } from "react-router-dom";
import { Header } from "../components/header";
import { useEffect, useState } from "react";

import Cookies from 'universal-cookie';

export function Articles() {
    //const navigate = useNavigate();

    const cookies = new Cookies();
    const token = cookies.get('access_login_token');

    return (
        <>
            <Header text={"Articles"} />
        </>
    )
}