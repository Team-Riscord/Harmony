import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css'; // Adjust the path as necessary if your file structure is different

const Homepage = () => {
    return (
        <div className="homepage">
            <div className="welcome-container">
                <img src={`${process.env.PUBLIC_URL}/icon.png`} alt="Harmony Icon" className="homepage-icon"/>
                <div>
                    <h1>Welcome to Harmony</h1>
                    <p>Harmony is a vibrant, user-friendly Discord clone designed for seamless communication and collaboration. It provides all the essential features needed for chatting, sharing, and connecting with your communities and friends.</p>
                    <p>Whether you're looking to set up a private server for your friends, join public communities, or simply stay in touch with your teams, Harmony brings the conversation to you, making every interaction memorable.</p>
                </div>
            </div>
            <div className="homepage-buttons">
                <Link to="/signup"><button className="signup-btn">Sign Up</button></Link>
                <Link to="/login"><button className="login-btn">Login</button></Link>
            </div>
        </div>
    );
};

export default Homepage;