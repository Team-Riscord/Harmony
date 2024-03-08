import './JoinServer.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { faCompass } from '@fortawesome/free-regular-svg-icons';

import { useState } from 'react';

import db from '../utils/firebase';

import { onValue, ref, push } from 'firebase/database';

export default function JoinServer({ userId, onClose, onBack }) {
    const [serverInvite, setServerInvite] = useState(null);
    const [showServerInviteError, setShowServerInviteError] = useState(false);
    const [serverInviteErrorText, setServerInviteErrorText] = useState(null);

    const goBackButton = () => {
        setShowServerInviteError(false);
        onBack();
    }

    const joinServer = () => {
        if (serverInvite === '' || serverInvite === null) {
            setServerInviteErrorText('* please enter an invite link');
            setShowServerInviteError(true);
            return;
        }

        let serverLink = serverInvite.split("https://riscord.gg/");
        if(serverLink.length > 1) {
            serverLink = serverLink[1];
        } else {
            serverLink = serverLink[0];
        }
    
        let userAlreadyInServer = false;

        const userServerList = localStorage.getItem('userServerList').split(",");
        for(const userServer in userServerList) {
            if(userServerList[userServer] == serverLink) {
                setServerInviteErrorText('* you are already a part of the server');
                setShowServerInviteError(true);
                userAlreadyInServer = true;
                return;
            }
        }
    
        if (!userAlreadyInServer) {
            let serverExists = false;

            onValue(ref(db, 'Servers/'), (snapshot) => {
                snapshot.forEach((childsnapshot) => {
                    const key = childsnapshot.key;
                    if(key == serverLink) {
                        serverExists = true;

                        const currentDateTime = new Date();
                        var datetime = currentDateTime.getDate() + "/" + (currentDateTime.getMonth()+1)  + "/" + currentDateTime.getFullYear() + " @ "  + currentDateTime.getHours() + ":"  + currentDateTime.getMinutes() + ":" + currentDateTime.getSeconds();
                        
                        const userData = JSON.parse(localStorage.getItem('userData'));
                        push(ref(db, 'Members/'), {
                            role: 'GUEST',
                            userID: userData.userKey,
                            serverID: key,
                            createdAt: datetime,
                            updatedAt: datetime
                        });

                        onClose();
                        return;
                    }
                });
                if(serverExists) {
                    return;
                }
            });
    
            if (!serverExists) {
                setServerInviteErrorText('* invalid invitation link');
                setShowServerInviteError(true);
                return;
            }
        }
    }    

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
                    <input type='text' id='server-invite' name='server-invite' onChange={(e) => {setServerInvite(e.target.value)}} />
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
    )
}