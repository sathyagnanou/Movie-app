import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Components/styles/RegisterPage.css'; // Import the CSS file for styling

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const registerUser = () => {
        if (email.length === 0) {
            alert("Email has left Blank!");
        } else if (password.length === 0) {
            alert("Password has left Blank!");
        } else {
            axios.post('http://127.0.0.1:5000/signup', {
                email: email,
                password: password
            })
            .then(function (response) {
                console.log(response);
                alert("Registration successful! You can now log in.");
                navigate("/login");  // Redirect to the login page after successful registration
            })
            .catch(function (error) {
                console.error(error);
                if (error.response) {
                    if (error.response.status === 409) {
                        alert("Email already exists. Please try a different email.");
                    } else {
                        alert("An error occurred. Please try again later.");
                    }
                } else {
                    alert("Network error. Please check your connection.");
                }
            });
        }
    }

    return (
        <div className="register-container">
            <h1 className="register-title">Create Your Account</h1>
            <form className="register-form">
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        id="email" 
                        className="form-input" 
                        placeholder="Enter a valid email address" 
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
                <button type="button" className="register-button" onClick={registerUser}>
                    Register
                </button>
                <p className="login-text">Already have an account? <a href="/login" className="login-link">Login</a></p>
            </form>
        </div>
    );
}

export { RegisterPage };
