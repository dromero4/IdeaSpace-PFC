import { useState } from "react";
import { Input } from "../components/forms/input";
import { Header } from "../components/header";

import { Eye, EyeClosed } from 'lucide-react';
import { Pen } from 'lucide-react';

export function Signup() {
    const [eye, setEye] = useState(false);
    const [error, setError] = useState([]);

    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        date: '',
        name: '',
    });

    function handleSubmit(e) {
        e.preventDefault();

        fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                return response.json();
            })
            .then(data => console.log(data.message))
            .catch(err => {
                console.error(err.message);
                if (err.errors) {
                    setError(err.errors);
                } else {
                    setError(["Ocurrió un error en el servidor."]);
                }
            });
    }

    function handleChange(e) {

        setForm(prevForm => ({
            ...prevForm, [e.target.name]: e.target.value
        }));
    }

    function handleClick() {
        setEye(!eye);
    }

    return (
        <>
            <Header text={"Let's set your account"} />
            <section className="flex justify-center items-center mt-10">
                <div className="flex bg-gray-200 w-xl h-122 rounded-md flex flex-row p-3">
                    <div className="bg-gray-300 rounded-[100px] w-40 h-40 m-5 flex justify-center items-center opacity-50">
                        <Pen />
                    </div>
                    <div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-[6px] ml-10 mt-2">
                            <Input type={"text"} text={"What's your name?"} placeholder={"John Smith"} name={"name"}
                                value={form.name}
                                onChange={handleChange} />

                            <Input type={"email"} text={"And your mail?"} placeholder={"example@example.ex"} name={"email"}
                                value={form.email}
                                onChange={handleChange} />

                            <Input type={"text"} text={"How shall we call you?"} placeholder={"JSmith"} name={"username"}
                                value={form.username}
                                onChange={handleChange} />

                            <Input type={"date"} text={"Birth date:"} placeholder={"John Smith"} name={"date"}
                                value={form.date}
                                onChange={handleChange} />

                            <Input type={eye ? 'text' : 'password'} text={"Enter your password:"} name={"password"}
                                value={form.password}
                                onChange={handleChange}>

                                {eye ? <Eye onClick={handleClick} /> : <EyeClosed onClick={handleClick} />}
                            </Input>
                            <Input type={eye ? 'text' : 'password'} text={"Re-enter your password"} name={"confirmPassword"}
                                value={form.confirmPassword}
                                onChange={handleChange} />


                            <button className="bg-gray-500">Sign up</button>
                        </form>
                    </div>
                </div>
            </section>

            {
                error &&
                <div className="text-red-500 flex justify-center">
                    <ul>
                        {error.map((error => {
                            return <li key={error}>{error}</li>;
                        }))}
                    </ul>
                </div>
            }
        </>
    )
}