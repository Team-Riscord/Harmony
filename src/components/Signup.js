import './Signup.css';

import db from '../utils/firebase';
import { useState, useEffect } from 'react';
import { push, ref, onValue } from 'firebase/database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import defaultProfileImage from '../images/default-profile-image.png';

export default function Signup() {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState('');

    const [emailErrorText, setEmailErrorText] = useState('');
    const [usernameErrorText, setUsernameErrorText] = useState('');

    const [fullnameError, setFullnameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const signupUser = () => {
        setFullnameError(false);
        setEmailError(false);
        setUsernameError(false);
        setPasswordError(false);

        let emptyFields = false;
    
        if (fullname === '' || email === '' || username === '' || password === '') {
            if (fullname === '') setFullnameError(true);
            if (email === '') {
                setEmailError(true); 
                setEmailErrorText('* please enter your email');
            } else {
                if (!validateEmail(email)) {
                    setEmailError(true);
                    setEmailErrorText('* please enter a valid email');
                }
            }
            if (username === '') setUsernameError(true); setUsernameErrorText('* please enter your username');
            if (password === '') setPasswordError(true);
            emptyFields = true;
        }
    
        onValue(ref(db, 'users/'), (snapshot) => {
            let emailExists = false;
            let usernameExists = false;
    
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                if (data) {
                    if (data.email === email) {
                        setEmailError(true);
                        setEmailErrorText('* Email already exists');
                        emailExists = true;
                    }
    
                    if (data.username === username) {
                        setUsernameError(true);
                        setUsernameErrorText('* Username already exists');
                        usernameExists = true;
                    }
                }
            });
    
            if (!emailExists && !usernameExists && !emptyFields) {
                const currentDateTime = new Date();
                var datetime = currentDateTime.getDate() + "/" + (currentDateTime.getMonth()+1)  + "/" + currentDateTime.getFullYear() + " @ "  + currentDateTime.getHours() + ":"  + currentDateTime.getMinutes() + ":" + currentDateTime.getSeconds();
                
                push(ref(db, 'Users/'), { // generates a unique user ID under which the following data will be stored
                    name: fullname,
                    email: email,
                    username: username,
                    password: password,
                    profileImage: profileImage === '' ? defaultProfileImage : profileImage,
                    createdAt: datetime,
                    updatedAt: datetime,
                    friends: [] //won't show up in the database at sign up as it is an empty array/list
                }).then(() => {
                    setFullname('');
                    setEmail('');
                    setUsername('');
                    setPassword('');
                    setProfileImage('');
                    setEmailErrorText('');
                    setUsernameErrorText('');

                    window.location.href = '/login';

                    return;
                }).catch((error) => {
                    console.error('Error adding user: ', error);
                });
            }
        });
    }

    const handleImageInput = (event) => {
        const file = event.target.files[0];
        if(file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }  

    useEffect(() => {
        const passwordCheckbox = document.querySelector("#signup-form-password-checkbox");
        passwordCheckbox.addEventListener("change", function() {
            const passwordInput = document.querySelector("#signup-form-password");
            if(passwordCheckbox.checked) {
                passwordInput.type = 'text';
            } else {
                passwordInput.type = 'password';
            }
        });
    }, []);

    return (
        <div className='signup-page'>
            <div className='signup-container'>
                <div className='signup-title'>
                    <h1>welcome to riscord</h1>
                    <h3>let's get you started!</h3>
                </div>
                <div className='signup-form'>
                    <div className='signup-form-content'>
                        <div className='signup-form-field'>
                            <label htmlFor='signup-form-name'>enter your full name</label>
                            <p id='signup-form-fullname-error' style={{visibility: fullnameError ? 'visible' : 'hidden', display: fullnameError ? 'block' : 'none'}}>* please enter your name</p>
                            <input type='text' id='signup-form-name' onChange={(e) => setFullname(e.target.value)} />
                        </div>
                        <div className='signup-form-field'>
                            <label htmlFor='signup-form-email'>enter your email</label>
                            <p id='signup-form-email-error' style={{visibility: emailError ? 'visible' : 'hidden', display: emailError ? 'block' : 'none'}}>{emailErrorText}</p>
                            <input type='text' id='signup-form-email' onChange={(e) => {setEmail(e.target.value.toLowerCase())}} />
                        </div>
                        <div className='signup-form-field'>
                            <label htmlFor='signup-form-username'>choose a username</label>
                            <p id='signup-form-username-error' style={{visibility: usernameError ? 'visible' : 'hidden', display: usernameError ? 'block' : 'none'}}>{usernameErrorText}</p>
                            <input type='text' id='signup-form-username' onChange={(e) => {setUsername(e.target.value.toLowerCase())}} />
                        </div>
                        <div className='signup-form-field'>
                            <label htmlFor='signup-form-password'>enter your password</label>
                            <p id='signup-form-password-error' style={{visibility: passwordError ? 'visible' : 'hidden', display: passwordError ? 'block' : 'none'}}>* please enter a password</p>
                            <input type='password' id='signup-form-password' onChange={(e) => {setPassword(e.target.value)}} />
                            <div className='signup-form-password-checkbox'>
                                <input type='checkbox'id='signup-form-password-checkbox' />
                                <label htmlFor='signup-form-password-checkbox'>show password</label>
                            </div>
                        </div>
                        <div className='signup-form-field'>
                            <h3 htmlFor='signup-form-profileImage'>choose a profile image</h3>
                            <label htmlFor='signup-form-profileImage' style={{width: '100px', marginLeft: 'auto', marginRight: 'auto'}}>
                                {profileImage ? (<img src={profileImage} alt='Profile Image' className='signup-form-image-input-icon signup-form-input-image' />) : (<FontAwesomeIcon icon={faUpload} className='signup-form-image-input-icon signup-form-input-icon' />)}
                            </label>
                            <input type="file" id="signup-form-profileImage" name="profile-image" accept="image/png, image/jpeg, image/jpg" onChange={handleImageInput} hidden />
                        </div>
                        <div className='signup-form-field' style={{display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
                            <button type='submit' onClick={signupUser}>signup</button>
                        </div>
                        <div className='login-page-link'>
                            <a href='/login'>already have an account? click to login!</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}