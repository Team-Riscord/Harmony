import './AddServer.css';

import db from '../utils/firebase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faUpload } from '@fortawesome/free-solid-svg-icons';

import { useState, useEffect } from 'react';

import { ref, onValue, push, set } from 'firebase/database';

export default function AddServer({ emailOrUsername, fetchData, onClose }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [serverName, setServerName] = useState('');

    const [userId, setUserId] = useState(null);

    const [showServerNameError, setShowServerNameError] = useState(false);
    const [showServerImageError, setShowServerImageError] = useState(false);

    useEffect(() => {
        const fetchData = () => {
            onValue(ref(db, 'users/'), (snapshot) => {
                snapshot.forEach((childsnapshot) => {
                    const data = childsnapshot.val();
                    const userId = childsnapshot.key;
                    if (data.email === emailOrUsername || data.username === emailOrUsername) {
                        setUserId(userId);
                        return;
                    }
                });
            });
        };
        fetchData();
    }, [emailOrUsername]);

    const createServer = () => {
        if(serverName == '' || selectedImage == null) {
            if(serverName == '') {
                setShowServerNameError(true);
            } else {
                setShowServerNameError(false);
            }

            if(selectedImage == null) {
                setShowServerImageError(true);
            } else {
                setShowServerImageError(false);
            }
        } else {
            push(ref(db, `users/${userId}/serverList/`), {
                serverName: serverName,
                serverIcon: selectedImage,
                serverAdmin: true
            });
    
            fetchData();
            onClose();
        }
    };

    const joinAServer = () => {
        onClose();
    }

    const handleImageInput = (event) => {
        const file = event.target.files[0];
        if(file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <div className='add-server-component'>
            <div className='add-server-close-icon-container'>
                <FontAwesomeIcon icon={faXmark} id='add-server-close-icon' onClick={onClose}/>
            </div>
            <div className='add-server-title'>
                <h1>customize your server</h1>
            </div>
            <div className='add-server-subtitle'>
                <p>Give your new server a personality with a name and an icon. You can always change it later.</p>
            </div>
            <div className='add-server-form'>
                <div className='add-server-form-image-input'>
                    <p style={{visibility: showServerImageError ? 'visible' : 'hidden'}}>* please select an icon for your server</p>
                    <label htmlFor='server-image'>
                        {selectedImage ? (<img src={selectedImage} alt='Selected Image' className='add-server-form-image-input-icon add-server-input-image' />) : (<FontAwesomeIcon icon={faUpload} className='add-server-form-image-input-icon add-server-input-icon' />)}
                    </label>
                    <input type="file" id="server-image" name="server-image" accept="image/png, image/jpeg, image/jpg" onChange={handleImageInput} hidden />
                </div>
                <div className='add-server-form-name-input'>
                    <div className='add-server-form-name-input-label'>
                        <label htmlFor='server-name'>server name</label>
                        <p style={{visibility: showServerNameError ? 'visible' : 'hidden'}}>* please enter a name for your server</p>
                    </div>
                    <input type='text' id='server-name' name='server-name' onChange={(e) => {setServerName(e.target.value)}} />
                </div>
                <p>By creating a server, you agree to Riscord's <a href='https://discord.com/guidelines' target='_blank'>Community Guidelines</a>.</p>
            </div>
            <div className='add-server-button'>
                <button type='submit' onClick={createServer}>Create</button>
            </div>
            <div className='add-server-join-invitation'>
                <p>Have an invite already? <a onClick={joinAServer}>Join a Server</a>!</p>
            </div>
        </div>
    )
}