import React, { useState } from "react";
import { Link } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";
import "./Signup.scss";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const result = await axiosClient.post("/auth/signup", {
                name,
                email,
                password,
            });
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="Signup flex justify-center items-center h-screen">
            <div className="signup-box bg-white rounded-lg shadow-lg p-8 transform transition duration-500 hover:scale-105">
                <h2 className="text-2xl font-semibold mb-4">Signup</h2>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <label htmlFor="name" className="mb-2 text-sm">Name</label>
                    <input
                        type="text"
                        className="border border-gray-300 rounded-md p-2 mb-4"
                        id="name"
                        onChange={(e) => setName(e.target.value)}
                    />

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

                    <input type="submit" value="Signup" className="bg-blue-500 text-white font-semibold py-2 rounded-md cursor-pointer transition duration-300 hover:bg-blue-600" />
                </form>
                <p className="mt-4 text-sm">
                    Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-700">Log In</Link>
                </p>
            </div>
        </div>

    );
}

export default Signup;
