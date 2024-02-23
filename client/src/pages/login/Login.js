import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, setItem } from "../../utils/localStorageManager";


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await axiosClient.post('/auth/login', {
                email,
                password
            });

            setItem(KEY_ACCESS_TOKEN, response.result.accessToken);
            navigate('/');

        } catch (error) {
            console.log(error);
        }
    }

    return (


                <div className="Login flex justify-center items-center h-screen">

                    <div className="login-box bg-white rounded-lg shadow-lg p-8 transform transition duration-500 hover:scale-105">
                        <h2 className="text-2xl font-semibold mb-4">Login</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col">
                            <label htmlFor="email" className="mb-2 text-sm">Email</label>
                            <input
                                type="email"
                                className="border border-gray-300 rounded-md p-2 mb-4"
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <label htmlFor="password" className="mb-2 text-sm">Password</label>
                            <input
                                type="password"
                                className="border border-gray-300 rounded-md p-2 mb-4"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <input type="submit" value="Login" className="bg-blue-500 text-white font-semibold py-2 rounded-md cursor-pointer transition duration-300 hover:bg-blue-600" />
                        </form>
                        <p className="mt-4 text-sm">
                            Do not have an account? <Link to="/signup" className="text-blue-500 hover:text-blue-700">Sign Up</Link>
                        </p>
                    </div>
                </div>
        

    );
}

export default Login;
