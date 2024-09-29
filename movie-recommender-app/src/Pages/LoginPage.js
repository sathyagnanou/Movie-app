import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './Components/styles/LoginPage.css'; // Import the CSS file for styling

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // For navigating to the home page

    const logInUser = () => {
        if (email.length === 0) {
            alert("Email cannot be blank!");
        } else if (password.length === 0) {
            alert("Password cannot be blank!");
        } else {
            axios.post('http://127.0.0.1:5000/login', {
                email: email,
                password: password
            })
            .then(function (response) {
                console.log(response);
                // On successful login, navigate to the home page
                navigate("/home");
            })
            .catch(function (error) {
                console.log(error, 'error');
                if (error.response && error.response.status === 401) {
                    alert("Invalid credentials");
                } else {
                    alert("An error occurred. Please try again.");
                }
            });
        }
    }

    return (
        <div className="login-container">
            <h1 className="login-title">Welcome Back!</h1>
            <form className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        id="email" 
                        className="form-input" 
                        placeholder="Enter your email" 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        id="password" 
                        className="form-input" 
                        placeholder="Enter your password" 
                    />
                </div>
                <button type="button" className="login-button" onClick={logInUser}>Login</button>
                <p className="register-text">Don't have an account? <a href="/register" className="register-link">Register</a></p>
            </form>
        </div>
    );
}
