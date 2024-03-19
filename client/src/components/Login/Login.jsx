import React, { useState } from 'react';
import './Login.css'; 
import axios from 'axios';

const Login = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to handle password visibility
    const [error, setError] = useState('');

    const loginUser = async () => {
        setError('');
        if (!emailOrUsername || !password) {
            setError('* Please fill in all fields');
            return;
        }

        try {
            const response = await axios.post("http://localhost:8800/login", { emailOrUsername, password });
            if (response.data.message === "Login successful") {
                localStorage.setItem('userLoggedIn', true);
                localStorage.setItem('userData', JSON.stringify(response.data.user));
                window.location.href = '/'; 
            } else {
                setError('* Incorrect email/username or password');
            }
        } catch (err) {
            console.error(err);
            setError('* Failed to log in. Please try again.');
        }
    };

    return (
        <div className="login-component">
            <div className="login-container">
                <div className="login-title">
                    <h1>Welcome back to Harmony</h1>
                    <h3>We're so excited to see you again!</h3>
                </div>
                <div className="login-form">
                    <label htmlFor="login-emailOrUsername">Email or Username</label>
                    <input 
                        type="text" 
                        id="login-emailOrUsername" 
                        value={emailOrUsername} 
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                    />
                    <label htmlFor="login-password">Password</label>
                    <input 
                        type={showPassword ? "text" : "password"}
                        id="login-password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="show-password">
                        <input 
                            type="checkbox" 
                            id="show-password" 
                            checked={showPassword}
                            onChange={(e) => setShowPassword(e.target.checked)}
                        />
                        <label htmlFor="show-password">Show Password</label>
                    </div>
                    {error && <div className="login-error">{error}</div>}
                    <button onClick={loginUser}>Login</button>
                </div>
                <div className="signup-link">
                    <p>Don't have an account? <a href="/signup">Sign up</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
                                                            