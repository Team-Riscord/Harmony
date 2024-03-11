import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './DMServerBar.css';

import { faUser, faPlus, faXmark, faGear, faBell } from '@fortawesome/free-solid-svg-icons';

import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import db from '../utils/firebase';

import AddFriend from './AddFriend';
import FriendsList from './FriendsList';

export default function DMServerBar() {
    const [userProfileImage, setUserProfileImage] = useState('');
    const [username, setUsername] = useState('');
    const [isAddFriendVisible, setIsAddFriendVisible] = useState(false);
    const [friendsList, setFriendsList] = useState([]);
    const [isFriendsListVisible, setIsFriendsListVisible] = useState(false);

    const fetchData = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            setUserProfileImage(userData.data.profileImage);
            setUsername(userData.data.username);

            let tempFriendsList = [];

            const snapshot = await get(ref(db, 'Users/'));
            snapshot.forEach((childsnapshot) => {
                const data = childsnapshot.val();
                for(const friend in userData.data.friends) {
                    if(userData.data.friends[friend] == childsnapshot.key) {
                        tempFriendsList.push([data.username, data.profileImage]);
                    }
                }
            });

            setFriendsList(tempFriendsList);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        if (isAddFriendVisible || isFriendsListVisible) {
            document.body.style.pointerEvents = 'none';
            if(isAddFriendVisible) {
                const addFriendComponent = document.querySelector('.add-friend-component');
                addFriendComponent.style.pointerEvents = 'auto';
            }
            if(isFriendsListVisible) {
                const friendsListComponent = document.querySelector('.friends-list-component');
                friendsListComponent.style.pointerEvents = 'auto';
            }
        } else {
            document.body.style.pointerEvents = 'auto';
        }

        fetchData();
    }, [isAddFriendVisible, isFriendsListVisible]); 

    const middleButtonClick = () => {
        setIsAddFriendVisible(true);
    }

    const handleAddFriendClose = () => {
        setIsAddFriendVisible(false);
        fetchData();
    };

    const DMTitleMouseOverText = (event) => {
        event.currentTarget.parentElement.querySelector('.serverbar-middle-DM-title-overlay-text').style.visibility = 'visible';
    }

    const DMTitleMouseOutText = (event) => {
        event.currentTarget.parentElement.querySelector('.serverbar-middle-DM-title-overlay-text').style.visibility = 'hidden';
    }

    return (
        <div className='serverbar-component'>
            <div className='serverbar-top'>
                <h1>Direct Messages</h1>
            </div>
            <div className='serverbar-middle'>
                <div className='serverbar-middle-default-buttons'>
                    <div className='serverbar-middle-default-button' id='serverbar-middle-add-friend-button' onClick={middleButtonClick}>
                        <div className='serverbar-middle-default-button-icon'>
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                        <div className='serverbar-middle-default-button-title'>
                            <p>add friend</p>
                        </div>
                    </div>
                    <div className='serverbar-middle-default-button' id='serverbar-middle-friend-request-button'>
                        <div className='serverbar-middle-default-button-icon'>
                            <FontAwesomeIcon icon={faBell} />
                        </div>
                        <div className='serverbar-middle-default-button-title'>
                            <p>Friend Requests</p>
                        </div>
                    </div>
                </div>

                <div className='serverbar-middle-DM-title'>
                        <div className='serverbar-middle-DM-title-text'>
                            <p>direct messages</p>
                        </div>
                        <div className='serverbar-middle-DM-title-icon' onMouseOver={DMTitleMouseOverText} onMouseOut={DMTitleMouseOutText}>
                            <FontAwesomeIcon icon={faPlus} onClick={() => {setIsFriendsListVisible(true)}}/>
                        </div>
                        <div className='serverbar-middle-DM-title-overlay-text' style={{visibility: 'hidden'}}>
                            <p>Create DM</p>
                        </div>
                </div>
                
                <div className='serverbar-middle-DM-buttons'>
                    {/* {friendsList.map((friend, index) => (
                    <div className='serverbar-middle-DM-button' key={index}>
                        <div className='serverbar-middle-DM-button-icon'>
                            <img src={friend[1]} />
                            <div className='serverbar-middle-DM-button-icon-status'>
                                <div className='serverbar-middle-DM-button-icon-status-child'></div>
                            </div>
                        </div>
                        <div className='serverbar-middle-DM-button-title'>
                            <p>{friend[0]}</p>
                        </div>
                        <div className='serverbar-middle-DM-button-close'>
                            <FontAwesomeIcon icon={faXmark} />
                        </div>
                    </div>))} */}
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
                <div className='serverbar-bottom-settings'>
                    <FontAwesomeIcon icon={faGear} id='serverbar-bottom-settings' />
                </div>
            </div>
            {isAddFriendVisible && <AddFriend onClose={handleAddFriendClose} />}
            {isFriendsListVisible && <FriendsList onClose={() => {setIsFriendsListVisible(false)}} />}
        </div>
    )
}