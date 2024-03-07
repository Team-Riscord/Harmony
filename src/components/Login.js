import './Login.css';

import db from '../utils/firebase';
import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';

export default function Login() {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');

    const [emailOrUsernameError, setEmailOrUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const [emailOrUsernameErrorText, setEmailOrUsernameErrorText] = useState('');
    const [passwordErrorText, setPasswordErrorText] = useState('');

    const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const loginUser = () => {
        setEmailOrUsernameError(false);
        setPasswordError(false);
        setEmailOrUsernameErrorText('');
        setPasswordErrorText('');
    
        if (emailOrUsername === '' || password === '') {
            if (emailOrUsername === '') {
                setEmailOrUsernameError(true);
                setEmailOrUsernameErrorText('* please enter your email or username');
            }
            if (password === '') {
                setPasswordError(true);
                setPasswordErrorText('* please enter your password');
            }
            return;
        }
    
        const data = emailOrUsername.split("@");
    
        if (data.length > 1) {
            if (!validateEmail(emailOrUsername)) {
                setEmailOrUsernameError(true);
                setEmailOrUsernameErrorText('* please enter a valid email');
                return;
            }
        }
    
        onValue(ref(db, 'users/'), (snapshot) => {
            let found = false;
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                if (data) {
                    if ((data.email === emailOrUsername || data.username === emailOrUsername) && data.password === password) {
                        found = true;
                        localStorage.setItem('userLoggedIn', true);
                        localStorage.setItem('userData', JSON.stringify({
                            "serverKey": childSnapshot.key,
                            data
                        }));
                        window.location.href='/';
                        return;
                    }
                }
            });
    
            if (!found) {
                setPasswordError(true);
                setPasswordErrorText('* incorrect email/username or password');
                setEmailOrUsernameError(true);
                setEmailOrUsernameErrorText('* incorrect email/username or password');
            }
        });
    }

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

    return (
        <div className='login-page'>
            <div className='login-container'>
                <div className='login-title'>
                    <h1>welcome back to riscord</h1>
                    <h3>we're so excited to see you!</h3>
                </div>
                <div className='login-form'>
                    <div className='login-form-content'>
                        <div className='login-form-field'>
                            <label htmlFor='login-form-emailOrUsername'>enter your email or username</label>
                            <p id='login-form-emailOrUsername-error' style={{visibility: emailOrUsernameError ? 'visible' : 'hidden', display: emailOrUsernameError ? 'block' : 'none'}}>{emailOrUsernameErrorText}</p>
                            <input type='text' id='login-form-emailOrUsername' onChange={(e) => {setEmailOrUsername(e.target.value)}} />
                        </div>
                        <div className='login-form-field'>
                            <label htmlFor='login-form-password'>enter your password</label>
                            <p id='login-form-password-error' style={{visibility: passwordError ? 'visible' : 'hidden', display: passwordError ? 'block' : 'none'}}>{passwordErrorText}</p>
                            <input type='password' id='login-form-password' onChange={(e) => {setPassword(e.target.value)}} />
                            <div className='login-form-password-checkbox'>
                                <input type='checkbox' id='login-form-password-checkbox' />
                                <label htmlFor='login-form-password-checkbox'>show password</label>
                            </div>
                        </div>
                        <div className='login-form-field' style={{display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
                            <button type='submit' onClick={loginUser}>login</button>
                        </div>
                        <div className='signup-page-link'>
                            <a href='/signup'>don't have an account? click to sign up!</a>
                        </div>
                    </div>
                </div>
            </div>
            
            {/*userFound && <Riscord />*/}
        </div>
    )
}