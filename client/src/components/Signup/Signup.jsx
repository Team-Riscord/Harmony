import './Signup.css';
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import defaultProfileImage from '../../images/default-profile-image.png';

const Signup = () => {
    const [profileImage, setProfileImage] = useState(null);
    const [nameError, setNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);

    const [nameErrorText, setNameErrorText] = useState("")
    const [emailErrorText, setEmailErrorText] = useState("");
    const [passwordErrorText, setPasswordErrorText] = useState("");
    const [usernameErrorText, setUsernameErrorText] = useState("");

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        username: "",
        image: ""
    });

    const fetchUserData = async () => {
        try {
            const res = await axios.get("http://localhost:8800/userdata");
            const userDataHTML = res.data;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = userDataHTML;
            const table = tempDiv.querySelector('table');
    
            if (!table) {
                console.log('No table found in the response');
                return null;
            }
    
            const userDataArray = [];
            
            for (let i = 1; i < table.rows.length; i++) {
                const row = table.rows[i];
                const userData = {};
                
                for (let j = 0; j < row.cells.length; j++) {
                    const columnHeader = table.rows[0].cells[j].textContent.toLowerCase();
                    const cellValue = row.cells[j].textContent;
                    userData[columnHeader] = cellValue;
                }
                
                userDataArray.push(userData);
            }
            
            return userDataArray;
        } catch(err) {
            console.log(err);
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

    const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setUser((prev) => ({
            ...prev,
            [name]: value
        }));

        switch (name) {
            case 'name':
                setNameError(value.trim() === '' ? true : false);
                setNameErrorText(value.trim() === '' ? "* please enter your name" : "");
                if (value.trim().length > 100) {
                    setNameError(true);
                    setNameErrorText("* name cannot be longer than 100 characters");
                }
                break;
            case 'email':
                setEmailError(value.trim() === '' ? true : false);
                setEmailErrorText(value.trim() === '' ? "* please enter your email" : "");
                if (value.trim().length > 100) {
                    setEmailError(true);
                    setEmailErrorText("* email cannot be longer than 100 characters");
                }
                break;
            case 'password':
                setPasswordError(value.trim() === '' ? true : false);
                setPasswordErrorText(value.trim() === '' ? "* please enter a password" : "");
                if (value.trim().length > 100) {
                    setPasswordError(true);
                    setPasswordErrorText("* password cannot be longer than 100 characters");
                }
                break;
            case 'username':
                setUsernameError(value.trim() === '' ? true : false);
                setUsernameErrorText(value.trim() === '' ? "* please choose a username for yourself" : "");
                if (value.trim().length > 10) {
                    setUsernameError(true);
                    setUsernameErrorText("* username cannot be longer than 10 characters");
                }
                break;
            default:
                break;
        }
    }


    const handleClick = async (e) => {
        e.preventDefault();

        let errorExists = false;
        const requiredFields = ['name', 'email', 'password', 'username'];
        for (const field of requiredFields) {
            if(user[field] === null || user[field] === "") {
                if(field === 'name') {
                    setNameError(true);
                    setNameErrorText("* please enter your name");
                }

                if(field === 'email') {
                    setEmailError(true);
                    setEmailErrorText("* please enter your email");
                } else {
                    if(!validateEmail(user['email']) && user['email'] !== '') {
                        setEmailError(true);
                        setEmailErrorText("* please enter a valid email");
                    }
                }

                if(field === 'password') {
                    setPasswordError(true);
                    setPasswordErrorText("* please enter a password");
                }

                if(field === 'username') {
                    setUsernameError(true);
                    setUsernameErrorText("* please choose a username for yourself");
                }

                errorExists = true;
            } else {
                if(field === 'name' && user[field].length > 100) {
                    setNameError(true);
                    setNameErrorText("* name cannot be longer than 100 characters");
                    errorExists = true;
                }

                if(field === 'email' && user[field].length > 100) {
                    setEmailError(true);
                    setEmailErrorText("* email cannot be longer than 100 characters");
                    errorExists = true;
                }

                if(field === 'password' && user[field].length > 100) {
                    setPasswordError(true);
                    setPasswordErrorText("* password cannot be longer than 100 characters");
                    errorExists = true;
                }

                if(field === 'username' && user[field].length > 10) {
                    setUsernameError(true);
                    setUsernameErrorText("* username cannot be longer than 10 characters");
                    errorExists = true;
                }
            }
        }

        if(!errorExists) {
            try {
                const userDataArray = await fetchUserData();
                if(userDataArray) {
                    const existingEmail = userDataArray.some(userData => userData.email === user.email);
                    const existingUsername = userDataArray.some(userData => userData.username === user.username);

                    let existingDetail = false;
                    
                    if(existingEmail) {
                        setEmailError(true);
                        setEmailErrorText("* email already exists");
                        existingDetail = true;
                    }
        
                    if(existingUsername) {
                        setUsernameError(true);
                        setUsernameErrorText("* username already exists");
                        existingDetail = true;
                    }
                    
                    if(!existingDetail) {
                        await axios.post("http://localhost:8800/userdata", {
                            ...user,
                            image: profileImage && profileImage.length > 0 ? profileImage : defaultProfileImage
                        });
                        console.log(defaultProfileImage);
                        window.location.href = '/login';
                    }
                } else {
                    await axios.post("http://localhost:8800/userdata", {
                        ...user,
                        image: profileImage && profileImage.length > 0 ? profileImage : defaultProfileImage
                    });
                    console.log(defaultProfileImage);
                    window.location.href = '/login';
                }
            } catch(err) {
                console.log(err);
            }
        }
    }

    const handleImageInput = (event) => {
        const file = event.target.files[0];
        if(file) {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
    
                    const max_width = 500;
                    const max_height = 500;
                    let width = img.width;
                    let height = img.height;
    
                    if (width > height) {
                        if (width > max_width) {
                            height *= max_width / width;
                            width = max_width;
                        }
                    } else {
                        if (height > max_height) {
                            width *= max_height / height;
                            height = max_height;
                        }
                    }
    
                    canvas.width = width;
                    canvas.height = height;

                    ctx.drawImage(img, 0, 0, width, height);
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    setProfileImage(compressedDataUrl);
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="signup-component">
            <div className="signup-container">
                <div className='signup-title'>
                    <h1>welcome to <span>harmony</span></h1>
                    <h3>let's get you started!</h3>
                </div>
                <div className="signup-form">
                    <div className="signup-form-name">
                        <label htmlFor='signup-form-name'>enter your full name</label>
                        <p id='signup-form-name-error' style={{visibility: nameError ? 'visible' : 'hidden', display: nameError ? 'block' : 'none'}}>{nameErrorText}</p>
                        <input type='text' id='signup-form-name' name="name" onChange={handleChange}/>
                    </div>
                    <div className="signup-form-email">
                        <label htmlFor='signup-form-email'>enter your email</label>
                        <p id='signup-form-email-error' style={{visibility: emailError ? 'visible' : 'hidden', display: emailError ? 'block' : 'none'}}>{emailErrorText}</p>
                        <input type='email' id='signup-form-email' name="email" onChange={handleChange}/>
                    </div>
                    <div className="signup-form-password">
                        <label htmlFor='signup-form-password'>enter your password</label>
                        <p id='signup-form-password-error' style={{visibility: passwordError ? 'visible' : 'hidden', display: passwordError ? 'block' : 'none'}}>{passwordErrorText}</p>
                        <input type='password' id='signup-form-password' name="password" onChange={handleChange}/>
                        <div className='signup-form-password-checkbox'>
                            <div className="signup-form-password-checkbox-col1">
                                <input type='checkbox'id='signup-form-password-checkbox' />
                            </div>
                            <div className="signup-form-password-checkbox-col2">
                                <label htmlFor='signup-form-password-checkbox'>show password</label>
                            </div>
                        </div>
                    </div>
                    <div className="signup-form-username">
                        <label htmlFor='signup-form-username'>choose a username</label>
                        <p id='signup-form-username-error' style={{visibility: usernameError ? 'visible' : 'hidden', display: usernameError ? 'block' : 'none'}}>{usernameErrorText}</p>
                        <input type='text' id='signup-form-username' name="username" onChange={handleChange}/>
                    </div>
                    <div className="signup-form-image">
                        <label htmlFor='signup-form-image' style={{width: '100px', marginLeft: 'auto', marginRight: 'auto'}}>
                            {profileImage ? (<img src={profileImage} alt='Profile Icon' className='signup-form-image-input-icon signup-form-input-image' />) : (<FontAwesomeIcon icon={faUpload} className='signup-form-image-input-icon signup-form-input-icon' />)}
                        </label>
                        <input type='file' id='signup-form-image' name="image" onChange={(event) => {
                            handleImageInput(event);
                            handleChange(event);
                        }} accept="image/png, image/jpeg, image/jpg" hidden/>
                    </div>
                    <div className="signup-form-button">
                        <button type="submit" onClick={handleClick}>sign up</button>
                    </div>
                </div>
                <div className='login-page-link'>
                    <a href='/login'>already have an account? click to login!</a>
                </div>
            </div>
        </div>
    )
}

export default Signup;