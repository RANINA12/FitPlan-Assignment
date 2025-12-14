import React, { useState } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.jpg"
import userpic from "../../assets/user pic.jpg"
const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="nav-brand">
                    <div className="nav-logo-placeholder">
                        <img src={logo} alt="Logo" />
                    </div>
                    <span className="brand-name">Fitness Plan</span>
                </div>
                <div className="nav-links">
                    <a href="#about" className="nav-item">About Us</a>
                    <a href="#footer" className="nav-item">Contact Us</a>
                </div>
                <div className="nav-auth">
                    {user ? (
                        <div className="user-profile">
                            <span className="username">Hi, {user}</span>
                            <div className="avatar-circle">
                                <img src={userpic} alt="User" />
                            </div>
                            <button className="btn-logout" onClick={() => logout()} > Logout  </button>
                        </div>
                    ) : (
                        <button className="btn-login" onClick={() => navigate("/Login")}>Login</button>
                    )}
                </div>

            </div>
        </nav>
    );
};

export default Navbar;