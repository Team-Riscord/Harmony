import './JoinServer.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { faCompass } from '@fortawesome/free-regular-svg-icons';

import { useEffect, useState } from 'react';

export default function JoinServer({ onClose, onBack }) {
    const [serverInvite, setServerInvite] = useState(null);
    const [showServerInviteError, setShowServerInviteError] = useState(false);
    const [closeJoinServerWindow, setCloseJoinServerWindow] = useState(false);

    useEffect(() => {
        if (!closeJoinServerWindow) {
            document.body.style.pointerEvents = 'none';
            const addServerComponent = document.querySelector('.join-server-component');
            addServerComponent.style.pointerEvents = 'auto';
        }
    }, [closeJoinServerWindow]);

    const goBackButton = () => {
        setShowServerInviteError(false);
        onBack();
    }

    const joinServer = () => {
        if(serverInvite == '' || serverInvite == null) {
            setShowServerInviteError(true);
            return;
        } else {
            setShowServerInviteError(false);
            onClose();
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
                        <p style={{visibility: (showServerInviteError ? 'visible' : 'hidden')}}>* please enter an invite link</p>
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