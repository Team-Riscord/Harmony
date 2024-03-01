import './Sidebar.css';

import AddServer from './AddServer';
import DownloadApps from './DownloadApps';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCompass, faDownload } from '@fortawesome/free-solid-svg-icons';
import DMIcon from '../images/direct-message-icon.png';

import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';

import db from '../utils/firebase';

export default function Sidebar({ emailOrUsername }) {
    const [isAddServerVisible, setIsAddServerVisible] = useState(false);
    const [isDownloadAppsVisible, setIsDownloadAppsVisible] = useState(false);
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
        if (isAddServerVisible || isDownloadAppsVisible) {
            document.body.style.pointerEvents = 'none';
            if(isAddServerVisible) {
                const addServerComponent = document.querySelector('.add-server-component');
                addServerComponent.style.pointerEvents = 'auto';
            } else if (isDownloadAppsVisible) {
                const downloadAppsComponent = document.querySelector('.download-apps-component');
                downloadAppsComponent.style.pointerEvents = 'auto';
            }
        } else {
            document.body.style.pointerEvents = 'auto';
        }

        fetchData();
    }, [emailOrUsername, userId, isAddServerVisible, isDownloadAppsVisible]);


    const showWindow = (event) => {
        const id = event.currentTarget.id;
        switch(id) {
            case 'add-server-icon':
                setIsAddServerVisible(true);
                break;
            case 'direct-message-icon':
                break;
            case 'explore-servers-icon':
                break;
            case 'download-apps-icon':
                setIsDownloadAppsVisible(true);
                break;
        }
    }

    const showOverlayText = (event) => {
        const overlayBox = event.currentTarget.parentNode.querySelector('.overlay-text');
        overlayBox.style.marginLeft = `${overlayBox.offsetWidth + 80}px`;
        if(overlayBox.offsetWidth > 200) {
            overlayBox.style.whiteSpace = 'wrap';
        }
        overlayBox.style.visibility = 'visible';
    }

    const hideOverlayText = (event) => {
        const overlayBox = event.currentTarget.parentNode.querySelector('.overlay-text');
        overlayBox.style.visibility = 'hidden';
    }

    return (
        <div className='sidebar-component'>
            <div className='sidebar-icon-container'>
                <div className='overlay-text' style={{visibility: 'hidden'}}>
                    <p>Direct Messages</p>
                </div>
                <div className='sidebar-icon default-icon' id='direct-message-icon' onClick={showWindow} onMouseOver={showOverlayText} onMouseOut={hideOverlayText}>
                    <span><img src={DMIcon} /></span>
                </div>
            </div>

            <hr />

            {serverList.map((server, index) => (
                <div className='sidebar-icon-container' key={index}>
                    <div className='overlay-text' style={{visibility: 'hidden'}}>
                        <p>{server[0]}</p>
                    </div>
                    <div className='sidebar-icon user-icon' id='user-server-icon' onClick={showWindow} onMouseOver={showOverlayText} onMouseOut={hideOverlayText}>
                        <span><img src={server[1]} /></span>
                    </div>
                </div>
            ))}

            <div className='sidebar-icon-container'>
                <div className='overlay-text' style={{visibility: 'hidden'}}>
                    <p>Add a Server</p>
                </div>
                <div className='sidebar-icon default-icon' id='add-server-icon' onClick={showWindow} onMouseOver={showOverlayText} onMouseOut={hideOverlayText}>
                    <span><FontAwesomeIcon icon={faPlus} /></span>
                </div>
            </div>

            <div className='sidebar-icon-container'>
                <div className='overlay-text' style={{visibility: 'hidden'}}>
                    <p>Explore Discoverable Servers</p>
                </div>
                <div className='sidebar-icon default-icon' id='explore-servers-icon' onClick={showWindow} onMouseOver={showOverlayText} onMouseOut={hideOverlayText}>
                    <span><FontAwesomeIcon icon={faCompass} /></span>
                </div>
            </div>

            <hr />

            <div className='sidebar-icon-container'>
                <div className='overlay-text' style={{visibility: 'hidden'}}>
                    <p>Download Apps</p>
                </div>
                <div className='sidebar-icon default-icon' id='download-apps-icon' onClick={showWindow} onMouseOver={showOverlayText} onMouseOut={hideOverlayText}>
                    <span><FontAwesomeIcon icon={faDownload} /></span>
                </div>
            </div>

            {isAddServerVisible && <AddServer emailOrUsername={emailOrUsername} fetchData={fetchData} onClose={() => {setIsAddServerVisible(false)}} /> }

            {isDownloadAppsVisible && <DownloadApps onClose={() => {setIsDownloadAppsVisible(false)}} />}
        </div>
    )
}