import './AddServer.css';

import db from '../utils/firebase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faUpload } from '@fortawesome/free-solid-svg-icons';

import { useState } from 'react';

import { ref, push } from 'firebase/database';

import JoinServer from './JoinServer';

export default function AddServer({ fetchData, onClose }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [serverName, setServerName] = useState('');

    const [showServerNameError, setShowServerNameError] = useState(false);
    const [showServerImageError, setShowServerImageError] = useState(false);
    const [showJoinServerWindow, setShowJoinServerWindow] = useState(false);

    const handleJoinServerBack = () => {
        setShowJoinServerWindow(false);
    };

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
            const currentDateTime = new Date();
            var datetime = currentDateTime.getDate() + "/" + (currentDateTime.getMonth()+1)  + "/" + currentDateTime.getFullYear() + " @ "  + currentDateTime.getHours() + ":"  + currentDateTime.getMinutes() + ":" + currentDateTime.getSeconds();

            const data = JSON.parse(localStorage.getItem('userData'));
            
            const newServerRef = push(ref(db, 'Servers/'), { //generates a unique server ID under which the following data will be stored
                serverName: serverName,
                serverIcon: selectedImage,
                serverAdmin: data.userKey,
                createdAt: datetime,
                updatedAt: datetime
            });

            const serverId = newServerRef.key;

            push(ref(db, 'Members/'), { //generates a unique member ID under which the following data will be stored
                role: 'ADMIN',
                userID: data.userKey,
                serverID: serverId,
                createdAt: datetime,
                updatedAt: datetime
            });
    
            fetchData();
            onClose();
        }
    };

    const joinAServer = () => {
        setShowJoinServerWindow(true);
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

            {showJoinServerWindow && <JoinServer onClose={onClose} onBack={handleJoinServerBack} /> }
        </div>
    )
}