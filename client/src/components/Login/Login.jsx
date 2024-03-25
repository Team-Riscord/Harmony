import './Login.css';
import { useState, useEffect } from "react";
import axios from "axios";

const Login = () => {
    const [loginData, setLoginData] = useState({
        emailOrUsername: "",
        password: ""
    });

    const [emailUsernameError, setEmailUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const [emailUsernameErrorText, setEmailUsernameErrorText] = useState("");
    const [passwordErrorText, setPasswordErrorText] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });

        switch (name) {
            case 'emailOrUsername':
                setEmailUsernameError(value.trim() === '' ? true : false);
                setEmailUsernameErrorText(value.trim() === '' ? "please enter your email or username" : "");
                break;
            case 'password':
                setPasswordError(value.trim() === '' ? true : false);
                setPasswordErrorText(value.trim() === '' ? "please enter your password" : "");
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        localStorage.clear();
        const passwordCheckbox = document.querySelector("#login-form-password-checkbox");
        passwordCheckbox.addEventListener("change", function() {
            const passwordInput = document.querySelector("#login-form-password");
            if(passwordCheckbox.checked) {
                passwordInput.type = 'text';
            } else {
                passwordInput.type = 'password';
            }
        });
    }, []);

    const handleClick = async (e) => {
        e.preventDefault();

        let errorExists = false;
        const requiredFields = ['emailOrUsername', 'password'];
        for (const field of requiredFields) {
            if(loginData[field] === null || loginData[field] === "") {
                if(field === "emailOrUsername") {
                    setEmailUsernameError(true);
                    setEmailUsernameErrorText("please enter your email or username");
                }

                if(field === "password") {
                    setPasswordError(true);
                    setPasswordErrorText("please enter your password");
                }

                errorExists = true;
            }
        }

        if(!errorExists) {
            try {
                const response = await axios.post("http://localhost:8800/login", loginData);
        
                if (response.status === 200) {
                    console.log("Login successful:", response.data.message);
                    localStorage.setItem('userData', JSON.stringify(response.data.user));
                    localStorage.setItem('isUserLoggedIn', true);
                }
            } catch (error) {
                setEmailUsernameError(true);
                setPasswordError(true);
                setEmailUsernameErrorText("wrong email/username or password");
                setPasswordErrorText("wrong email/username or password");
            }
        }
    }

    return (
        <div className='login-component'>
            <div className='login-container'>
                <div className='login-title'>
                    <h1>welcome to <span>harmony</span></h1>
                    <h3>we're so excited to see you!</h3>
                </div>
                <div className="login-form">
                    <div className="login-form-email-username">
                        <label htmlFor='login-form-email-username'>enter your email or username</label>
                        <p id='signup-form-email-username-error' style={{visibility: emailUsernameError ? 'visible' : 'hidden', display: emailUsernameError ? 'block' : 'none'}}>{emailUsernameErrorText}</p>
                        <input type='text' id='login-form-email-username' name="emailOrUsername" onChange={handleChange}/>
                    </div>
                    <div className="login-form-password">
                        <label htmlFor='login-form-password'>enter your password</label>
                        <p id='signup-form-password-error' style={{visibility: passwordError ? 'visible' : 'hidden', display: [passwordError] ? 'block' : 'none'}}>{passwordErrorText}</p>
                        <input type='password' id='login-form-password' name="password" onChange={handleChange}/>
                        <div className='login-form-password-checkbox'>
                            <div className="login-form-password-checkbox-col1">
                                <input type='checkbox'id='login-form-password-checkbox' />
                            </div>
                            <div className="login-form-password-checkbox-col2">
                                <label htmlFor='login-form-password-checkbox'>show password</label>
                            </div>
                        </div>
                    </div>
                    <div className="login-form-button">
                        <button type="submit" onClick={handleClick}>login</button>
                    </div>
                </div>
                <div className='signup-page-link'>
                    <a href='/signup'>don't have an account? click here to signup!</a>
                </div>
            </div>
        </div>
    )
}

export default Login;