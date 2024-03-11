import './FriendsList.css';

import profileImage from '../images/default-profile-image.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function FriendsList({ onClose }) {
    return (
        <div className='friends-list-component'>
            <div className='friends-list-title'>
                <div className='friends-list-title-text'>
                    <h1>Your Friends List</h1>
                </div>
                <div className='friends-list-close-icon'>
                    <FontAwesomeIcon icon={faXmark} id='friends-list-close-icon' onClick={() => {onClose()}}/>
                </div>
            </div>
            <div className='friends-list-buttons'>
                <div className='friends-list-button'>
                    <div className='friends-list-button-image'>
                        <img src={profileImage} />
                    </div>
                    <div className='friends-list-button-username'>
                        <p>Test User</p>
                    </div>
                    <div className='friends-list-button-chat'>
                        <button>Chat</button>
                    </div>
                </div>
            </div>
        </div>
    )
}