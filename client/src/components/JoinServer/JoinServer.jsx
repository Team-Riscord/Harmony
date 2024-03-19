import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faChevronRight, faCompass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './JoinServer.css';

export default function JoinServer({ userId, onClose, onBack }) {
    const [serverInvite, setServerInvite] = useState('');
    const [showServerInviteError, setShowServerInviteError] = useState(false);
    const [serverInviteErrorText, setServerInviteErrorText] = useState('');
    const setErrorMessage = useState('');

    const goBackButton = () => {
        setShowServerInviteError(false);
        onBack();
    }

    const joinServer = async () => {
        // Check if the server invite is empty or null
        if (!serverInvite || serverInvite === '') {
            setServerInviteErrorText('* please enter an invite link');
            setShowServerInviteError(true);
            return;
        }

        // Regular expression pattern to validate invite links
        const inviteLinkPattern = /^(https?:\/\/)?(www\.)?riscord\.gg\/[a-zA-Z0-9]+$/;

        // Check if the invite link matches the pattern
        if (!inviteLinkPattern.test(serverInvite)) {
            setServerInviteErrorText('* invalid invitation link format');
            setShowServerInviteError(true);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8800/join-server', {
                userId,
                inviteLink: serverInvite,
            });
            
            console.log(response.data); // Success message
            onClose(); // Close the join server dialog
        } catch (error) {
            console.error('Error joining server:', error);
            // Handle error (e.g., show error message)
            setShowServerInviteError(true);
            setErrorMessage('* invalid invitation link or you are already a part of the server');
        }
    };

    return (
        <div className='join-server-component'>
            <div className='join-server-close-icon-container'>
                <FontAwesomeIcon icon={faXmark} id='join-server-close-icon' onClick={onClose}/>
            </div>
            <div className='join-server-title'>
                <h1>join a server</h1>
            </div>
            <div className='join-server-subtitle'>
                <p>Enter an invite below to join an existing server</p>
            </div>
            <div className='join-server-form'>
                <div className='join-server-form-invite-input'>
                    <div className='join-server-form-invite-input-label'>
                        <label htmlFor='server-invite'>Invite Link</label>
                        <p style={{visibility: (showServerInviteError ? 'visible' : 'hidden')}}>{serverInviteErrorText}</p>
                    </div>
                    <input type='text' id='server-invite' name='server-invite' value={serverInvite} onChange={(e) => {setServerInvite(e.target.value)}} />
                </div>
            </div>
            <div className='join-server-invite-example'>
                <h3>Invites should look like</h3>
                <p>hTKzmak</p>
                <p>https://riscord.gg/hTKzmak</p>
                <p>https://riscord.gg/cool-people</p>
            </div>
            <div className='join-server-discover-servers-button'>
                <div className='join-server-discover-servers-button-icon'>
                    <FontAwesomeIcon icon={faCompass} />
                </div>
                <div className='join-server-discover-servers-button-text'>
                    <h3>Don't have an invite?</h3>
                    <p>Check out Discoverable communities in Server Discovery.</p>
                </div>
                <div className='join-server-discover-servers-button-arrow'>
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
            </div>
            <div className='join-server-button'>
                <div className='join-server-back-button'>
                    <p onClick={goBackButton}>Back</p>
                </div>
                <div className='join-server-join-button'>
                    <button onClick={joinServer}>Join Server</button>
                </div>
            </div>
        </div>
    );
}
