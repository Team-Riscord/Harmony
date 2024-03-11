import './FriendsList.css';

import profileImage from '../images/default-profile-image.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { useEffect, useState } from 'react';
import db from '../utils/firebase';
import { get, ref, onValue } from 'firebase/database';

export default function FriendsList({ onClose }) {
    const [friendsList, setFriendsList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const userDataFromLocalStorage = JSON.parse(localStorage.getItem('userData'));
            const friendsRef = ref(db, `Users/${userDataFromLocalStorage.userKey}/friends/`);

            onValue(friendsRef, (snapshot) => {
                const friendsData = snapshot.val();
                if (friendsData) {
                    const promises = Object.keys(friendsData).map(async (friendKey) => {
                        const friendSnapshot = await get(ref(db, `Users/${friendsData[friendKey].userId}/`));
                        const friendUserData = friendSnapshot.val();
                        return [friendUserData.profileImage, friendUserData.username];
                    });

                    Promise.all(promises).then((friendDetails) => {
                        setFriendsList(friendDetails);
                    }).catch((error) => {
                        console.error('Error fetching friend details:', error);
                    });
                } else {
                    setFriendsList([]);
                }
            });
        };

        fetchData();
    }, []);

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
                {friendsList.map((friend, index) => (
                <div className='friends-list-button' key={index}>
                    <div className='friends-list-button-image'>
                        <img src={friend[0]} />
                    </div>
                    <div className='friends-list-button-username'>
                        <p>{friend[1]}</p>
                    </div>
                    <div className='friends-list-button-chat'>
                        <button>Chat</button>
                    </div>
                </div>))}
            </div>
        </div>
    )
}