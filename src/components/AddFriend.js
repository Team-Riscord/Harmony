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
        let requestAlreadySent = false;
        let requestAlreadyReceived = false;
    
        const [sentRequestSnapshot, friendRequestSnapshot, snapshot] = await Promise.all([
            get(ref(db, `Users/${userData.userKey}/sentRequests/`)),
            get(ref(db, `Users/${userData.userKey}/friendRequests/`)),
            get(ref(db, 'Users/'))
        ]);
    
        for (const childsnapshot of sentRequestSnapshot) {
            const data = childsnapshot.val();
            if (data.userName === friendUsername) {
                setErrorText('* friend request has already been sent...awaiting response ⌛️');
                requestAlreadySent = true;
                break;
            }
        }
    
        if (requestAlreadySent) {
            return;
        }
    
        for (const childsnapshot of friendRequestSnapshot) {
            const data = childsnapshot.val();
            const userData = await get(ref(db, `Users/${data.userId}/username`));
            if (userData.val() === friendUsername) {
                setErrorText('* please check your friend requests as it appears that your friend has already sent you one');
                requestAlreadyReceived = true;
                break;
            }
        }
    
        if (requestAlreadyReceived) {
            return;
        }
    
        if (friendUsername === '') {
            setErrorText('* Please enter a username to add as a friend');
            return;
        }
    
        if (friendUsername === userData.data.username) {
            setErrorText('* you cannot add yourself as friend, but you can be your own friend :)');
            return;
        }
    
        try {
            let userFound = false;
            for (const childsnapshot of snapshot) {
                const data = childsnapshot.val();
                if (data.username === friendUsername) {
                    const userDataFromLocalStorage = JSON.parse(localStorage.getItem('userData'));
                    await Promise.all([
                        push(ref(db, `Users/${childsnapshot.key}/friendRequests/`), { userId: userDataFromLocalStorage.userKey }),
                        push(ref(db, `Users/${userDataFromLocalStorage.userKey}/sentRequests/`), { userName: data.username })
                    ]);
                    userFound = true;
                    setErrorText('');
                    onClose();
                    break;
                }
            }
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