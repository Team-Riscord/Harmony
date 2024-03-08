import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './DMServerBar.css';

import { faUser, faPlus, faXmark, faMicrophone, faHeadphones, faGear } from '@fortawesome/free-solid-svg-icons';

import { useEffect, useState } from 'react';

export default function DMServerBar() {
    const [userProfileImage, setUserProfileImage] = useState('');
    const [username, setUsername] = useState('');

    const DMTitleMouseOverText = (event) => {
        event.currentTarget.parentElement.querySelector('.serverbar-middle-DM-title-overlay-text').style.visibility = 'visible';
    }

    const DMTitleMouseOutText = (event) => {
        event.currentTarget.parentElement.querySelector('.serverbar-middle-DM-title-overlay-text').style.visibility = 'hidden';
    }

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('userData'));
        setUserProfileImage(data.data.profileImage);
        setUsername(data.data.username);
    }); 

    return (
        <div className='serverbar-component'>
            <div className='serverbar-top'>
                <button>Find or Start a Conversation</button>
            </div>
            <div className='serverbar-middle'>
                <div className='serverbar-middle-default-buttons'>
                    <div className='serverbar-middle-default-button' id='serverbar-middle-friends-button'>
                        <div className='serverbar-middle-default-button-icon'>
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                        <div className='serverbar-middle-default-button-title'>
                            <p>friends</p>
                        </div>
                    </div>
                </div>
                <div className='serverbar-middle-DM-buttons'>
                    <div className='serverbar-middle-DM-title'>
                        <div className='serverbar-middle-DM-title-text'>
                            <p>direct messages</p>
                        </div>
                        <div className='serverbar-middle-DM-title-icon' onMouseOver={DMTitleMouseOverText} onMouseOut={DMTitleMouseOutText}>
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                        <div className='serverbar-middle-DM-title-overlay-text' style={{visibility: 'hidden'}}>
                            <p>Create DM</p>
                        </div>
                    </div>
                    <div className='serverbar-middle-DM-button-section'>
                        <div className='serverbar-middle-DM-button'>
                            <div className='serverbar-middle-DM-button-icon'>
                                <img src={userProfileImage} />
                                <div className='serverbar-middle-DM-button-icon-status'>
                                    <div className='serverbar-middle-DM-button-icon-status-child'></div>
                                </div>
                            </div>
                            <div className='serverbar-middle-DM-button-title'>
                                <p>Test User</p>
                            </div>
                            <div className='serverbar-middle-DM-button-close'>
                                <FontAwesomeIcon icon={faXmark} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='serverbar-bottom'>
                <div className='serverbar-bottom-user'>
                    <div className='serverbar-bottom-user-icon'>
                        <img src={userProfileImage} />
                        <div className='serverbar-middle-DM-button-icon-status'>
                            <div className='serverbar-middle-DM-button-icon-status-child'></div>
                        </div>
                    </div>
                    <div className='serverbar-bottom-user-name'>
                        <h3>{username}</h3>
                    </div>
                </div>
                <div className='serverbar-bottom-mic'>
                    <FontAwesomeIcon icon={faMicrophone} id='serverbar-bottom-mic' />
                </div>
                <div className='serverbar-bottom-headphones'>
                    <FontAwesomeIcon icon={faHeadphones} id='serverbar-bottom-headphones' />
                </div>
                <div className='serverbar-bottom-settings'>
                    <FontAwesomeIcon icon={faGear} id='serverbar-bottom-settings' />
                </div>
            </div>
        </div>
    )
}