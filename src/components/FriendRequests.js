import './FriendRequests.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';

import { useEffect, useState } from 'react';

import db from '../utils/firebase';
import { get, ref, remove, push, onValue } from 'firebase/database';

export default function FriendRequests({ onClose }) {
    const [friendRequestsList, setFriendRequestsList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const userDataFromLocalStorage = JSON.parse(localStorage.getItem('userData'));
            const friendRequestsRef = ref(db, `Users/${userDataFromLocalStorage.userKey}/friendRequests`);

            onValue(friendRequestsRef, (snapshot) => {
                const requestsData = snapshot.val();
                if (requestsData) {
                    const promises = Object.keys(requestsData).map(async (requestKey) => {
                        const requestData = requestsData[requestKey];
                        const userSnapshot = await get(ref(db, `Users/${requestData.userId}`));
                        const userData = userSnapshot.val();
                        return [userData.username, userData.profileImage, userSnapshot.key, requestKey];
                    });

                    Promise.all(promises).then((requestDetails) => {
                        setFriendRequestsList(requestDetails);
                    }).catch((error) => {
                        console.error('Error fetching friend request details:', error);
                    });
                } else {
                    setFriendRequestsList([]);
                }
            });
        };

        fetchData();
    }, []);

    const declineFriendRequest = (event) => {
        const requestId = event.currentTarget.parentElement.parentElement.parentElement.id;
        
        const updatedFriendRequestsList = friendRequestsList.filter(request => request.id == requestId);
        setFriendRequestsList(updatedFriendRequestsList);

        const userDataFromLocalStorage = JSON.parse(localStorage.getItem('userData'));
        remove(ref(db, `Users/${userDataFromLocalStorage.userKey}/friendRequests/${requestId}`));
    }

    const acceptFriendRequest = (event) => {
        const userDataFromLocalStorage = JSON.parse(localStorage.getItem('userData'));
        const friendId = event.currentTarget.parentElement.parentElement.parentElement.querySelector('.friend-requests-button-username p').id;
        push(ref(db, `Users/${userDataFromLocalStorage.userKey}/friends/`), {
            userId: friendId
        });

        push(ref(db, `Users/${friendId}/friends/`), {
            userId: userDataFromLocalStorage.userKey
        });

        declineFriendRequest(event);
    }

    return (
        <div className='friend-requests-component'>
            <div className='friend-requests-title'>
                <div className='friend-requests-title-text'>
                    <h1>Friend Requests</h1>
                </div>
                <div className='friend-requests-close-icon'>
                    <FontAwesomeIcon icon={faXmark} id='friend-requests-close-icon' onClick={() => {onClose()}}/>
                </div>
            </div>
            <div className='friend-requests-buttons'>
                {friendRequestsList.map((request, index) => (
                <div className='friend-requests-button' key={index} id={request[3]}>
                    <div className='friend-requests-button-image'>
                        <img src={request[1]} />
                    </div>
                    <div className='friend-requests-button-username'>
                        <p id={request[2]}>{request[0]}</p>
                    </div>
                    <div className='friend-requests-button-chat'>
                        <div className='friend-requests-accept-button'>
                            <button onClick={acceptFriendRequest}><FontAwesomeIcon icon={faCheck} /></button>
                        </div>
                        <div className='friend-requests-decline-button'>
                            <button onClick={declineFriendRequest}><FontAwesomeIcon icon={faXmark} /></button>
                        </div>
                    </div>
                </div>))}
            </div>
        </div>
    )
}