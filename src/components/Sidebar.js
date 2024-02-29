import './Sidebar.css';

import AddServer from './AddServer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import DMIcon from '../images/direct-message-icon.png';

import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';

import db from '../utils/firebase';

export default function Sidebar({ emailOrUsername }) {
    const [isAddServerVisible, setIsAddServerVisible] = useState(false);
    const [serverList, setServerList] = useState([]);
    const [userId, setUserId] = useState(null);

    const fetchData = async () => {
        const tempList = [];
        const snapshot = await get(ref(db, 'users/'));
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            if (data.email === emailOrUsername || data.username === emailOrUsername) {
                const userId = childSnapshot.key;
                setUserId(userId);
                for (const serverId in data.serverList) {
                    const serverData = data.serverList[serverId];
                    tempList.push([serverData.serverName, serverData.serverIcon]);
                }
            }
        });
        setServerList(tempList);
    };

    useEffect(() => {
        if (isAddServerVisible) {
            document.body.style.pointerEvents = 'none';
            const addServerComponent = document.querySelector('.add-server-component');
            addServerComponent.style.pointerEvents = 'auto';
        } else {
            document.body.style.pointerEvents = 'auto';
        }

        fetchData();
    }, [emailOrUsername, userId, isAddServerVisible]);


    const showWindow = (event) => {
        const id = event.currentTarget.id;
        switch(id) {
            case 'add-server-icon':
                setIsAddServerVisible(true);
                break;
            case 'direct-message-icon':
                break;
        }
    }

    return (
        <div className='sidebar-component'>
            <div className='sidebar-icon-container'>
                <div className='sidebar-icon default-icon' id='direct-message-icon' onClick={showWindow}>
                    <span><img src={DMIcon} /></span>
                </div>
            </div>

            <hr />

            {serverList.map((server, index) => (
                <div className='sidebar-icon-container' key={index}>
                    <div className='sidebar-icon user-icon' id='user-server-icon' onClick={showWindow}>
                        <span><img src={server[1]} /></span>
                    </div>
                </div>
            ))}

            <div className='sidebar-icon-container'>
                <div className='sidebar-icon default-icon' id='add-server-icon' onClick={showWindow}>
                    <span><FontAwesomeIcon icon={faPlus} /></span>
                </div>
            </div>

            {isAddServerVisible && <AddServer emailOrUsername={emailOrUsername} fetchData={fetchData} onClose={() => {setIsAddServerVisible(false)}} /> }
        </div>
    )
}