import { useState } from "react";
import { Button } from '../components/button.jsx'

export function Login() {
    const [form, setForm] = useState({ username: "", password: "" });

    async function handleForm(e) {
        //peticion async-await para enviar al servidor.
        e.preventDefault();

        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await response.json();

        //mensaje del servidor.
        console.log(data.message);
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    return (
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
                <p className="text-[12px]">Did you forget your password?</p>
                <div className="flex flex-row justify-around mt-10">
                    <img src='img/public-marks/google (1).svg' alt="google logo" width={40} />
                    <img src='img/public-marks/github-light (1).svg' alt="google logo" width={40} />
                    <img src='img/public-marks/x.svg' alt="google logo" width={40} />
                </div>
            </div>
        </section>
    )
}
{/* <p className="text-[12px] flex justify-start">Did you forget your password?</p>
                <div className="flex flex-row justify-around mt-10">
                    <img src='img/public-marks/google (1).svg' alt="google logo" width={40} />
                    <img src='img/public-marks/github-light (1).svg' alt="google logo" width={40} />
                    <img src='img/public-marks/x.svg' alt="google logo" width={40} />
                </div> */}