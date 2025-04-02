import { useEffect, useState } from "react";
import { Button } from '../components/button.jsx'

import '../CSS/styles.css';
import { showToast } from "../utils/modal.js";

import Cookies from 'universal-cookie';

import { useSocket } from "../context/SocketContext.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function Login() {
    const socket = useSocket();

    const cookies = new Cookies();

    const [form, setForm] = useState({ username: "", password: "" });

    async function handleForm(e) {
        e.preventDefault();

        socket.emit('message', { type: "user_login", username: form.username, password: form.password });
    }

    const navigate = useNavigate();
    const { setIsLogged } = useAuth();

    useEffect(() => {
        if (socket) {
            socket.on("message", data => {
                const type = data.type;

                switch (type) {
                    case "login_successful":
                        console.log("login successful");
                        const token = data.token;

                        if (token) cookies.set("access_login_token", token);
                        else return;

                        if (data.logged) setIsLogged(true);
                        else setIsLogged(false);

                        showToast(data.message, "success");
                        setTimeout(() => {
                            navigate('/');
                        }, "1500");
                        break;
                    case "login_incorrect":
                        console.log("Login incorrect");
                        showToast(data.message, "error");
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

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }



    return (
        <>
            <section className="flex justify-center items-center h-138">
                <div className="w-100 h-100 p-12 bg-white shadow-2xl rounded-lg ">
                    <form onSubmit={handleForm} className="flex items-center flex-col gap-4">
                        <h1 className="text-3xl">Log in</h1>
                        <label htmlFor="username" aria-label="username"></label>
                        <input type="text" name="username" placeholder="username" className="w-50 focus:bg-gray-100 border-1 rounded-md p-1"
                            value={form.username}
                            onChange={handleChange} />

                        <label htmlFor="password" aria-label="password"></label>
                        <input type="password" name="password" placeholder="password" className="w-50 focus:bg-gray-100 border-1 rounded-md p-1"
                            value={form.password}
                            onChange={handleChange} />
                        <Button text={"Sign in"} />
                    </form>
                    <p className="text-[12px]">Forgot your password?</p>
                    <div className="flex flex-row justify-around mt-3">
                        <img src='img/public-marks/google (1).svg' alt="google logo" width={40} />
                        <img src='img/public-marks/github-light (1).svg' alt="google logo" width={40} />
                        <img src='img/public-marks/x.svg' alt="google logo" width={40} />
                    </div>
                </div>
            </section>
            <div id="toast" className="hidden">
                <p id="toast-message"></p>
            </div>
        </>
    )
}