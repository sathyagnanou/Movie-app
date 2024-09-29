import React from 'react';
import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./Pages/Home";
import SearchResult from "./Pages/SearchResult";
import Chatbot from "./Pages/Chatbot"; // Import Chatbot page
import LoginPage from './Pages/LoginPage'; // Import Login page
import RegisterPage from './Pages/RegisterPage'; // Import Register page

function App() {
    return (
        

                <Router>
                    <Routes>
                        {/* Default route lands on LoginPage */}
                        <Route path="/" element={<Navigate to="/login" />} />  {/* Redirect to Login as the default route */}
                        <Route path="/home" element={<Home />} />    {/* Home route */}
                        <Route path="/search/:id" element={<SearchResult />} />
                        <Route path="/chatbot" element={<Chatbot />} /> {/* Chatbot route */}

                        {/* Login/Register routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Routes>
                </Router>
    )
}

export default App;
