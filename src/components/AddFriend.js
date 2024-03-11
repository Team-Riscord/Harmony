import './AddFriend.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { get, ref, push } from 'firebase/database';

import db from '../utils/firebase';

export default function AddFriend({ onClose }) {
    const [errorText, setErrorText] = useState('');
    const [friendUsername, setFriendUsername] = useState('');

    const userData = JSON.parse(localStorage.getItem('userData'));

    const addFriend = async () => {
        if (friendUsername === '') {
            setErrorText('* Please enter a username to add as a friend');
            return;
        }

        if(friendUsername == userData.data.username) {
            setErrorText('* you cannot add yourself as friend, but you can be your own friend :)');
            return;
        }

        try {
            const snapshot = await get(ref(db, 'Users/'));
            let userFound = false;
            snapshot.forEach((childsnapshot) => {
                const data = childsnapshot.val();
                if (data.username === friendUsername) {
                    //if the key already exists in the friends list, then say that the friend already exists.
                    
                    const userDataFromLocalStorage = JSON.parse(localStorage.getItem('userData'));
                    push(ref(db, `Users/${childsnapshot.key}/friendRequests/`), {
                        userId: userDataFromLocalStorage.userKey
                    });
                    
                    userFound = true;
                    setErrorText('');
                    onClose();
                    return;
                }
            });
            if (!userFound) {
                setErrorText('* User does not exist');
            }
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    };
    
    return (
        <div className='add-friend-component'>
            <div className='add-friend-title'>
                <div className='add-friend-title-text'>
                    <h1>Add Friend</h1>
                </div>
                <div className='add-friend-close'>
                    <FontAwesomeIcon icon={faXmark} style={{cursor: 'pointer'}} onClick={onClose}/>
                </div>
            </div>
            <div className='add-friend-subtitle'>
                <div style={{gridRow: '1'}}>
                    <h3>You can add friends with their Riscord username.</h3>
                </div>
                <div style={{gridRow: '2'}}>
                    <p style={{visibility: errorText == '' ? 'hidden' : 'visible'}}>{errorText}</p>
                </div>
            </div>
            <div className='add-friend-user-input'>
                <div className='add-friend-input'>
                    <input type='text' onChange={(e) => {setFriendUsername(e.target.value)}}/>
                </div>
                <div className='add-friend-button'>
                    <button type='submit' onClick={addFriend}>send friend request</button>
                </div>
            </div>
        </div>
    )
}