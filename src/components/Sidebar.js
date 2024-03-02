import './Sidebar.css';

import AddServer from './AddServer';
import DownloadApps from './DownloadApps';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCompass, faDownload } from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';

import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';

import db from '../utils/firebase';

export default function Sidebar({ emailOrUsername }) {
    const [isAddServerVisible, setIsAddServerVisible] = useState(false);
    const [isDownloadAppsVisible, setIsDownloadAppsVisible] = useState(false);
    const [serverList, setServerList] = useState([]);
    const [userId, setUserId] = useState(null);
    const [hoverIndicatorVisible, setHoverIndicatorVisible] = useState(false);
    const [currentIconID, setCurrentIconID] = useState(null);

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

        if (!isAddServerVisible) {
            const prevElement = document.getElementById('add-server-icon');
            prevElement.style.borderRadius = '30px';
            prevElement.style.color = 'rgb(80, 163, 97)';
            prevElement.style.backgroundColor = 'rgb(49, 51, 56)';
    
            const prevElementHoverIndicator = prevElement.parentElement.querySelector('.sidebar-icon-hover-indicator');
            prevElementHoverIndicator.style.height = '20px';
            prevElementHoverIndicator.style.visibility = 'hidden';
        }

        if (!isDownloadAppsVisible) {
            const prevElement = document.getElementById('download-apps-icon');
            prevElement.style.borderRadius = '30px';
            prevElement.style.color = 'rgb(80, 163, 97)';
            prevElement.style.backgroundColor = 'rgb(49, 51, 56)';
    
            const prevElementHoverIndicator = prevElement.parentElement.querySelector('.sidebar-icon-hover-indicator');
            prevElementHoverIndicator.style.height = '20px';
            prevElementHoverIndicator.style.visibility = 'hidden';
        }
    }, [emailOrUsername, userId, isAddServerVisible, isDownloadAppsVisible]);

    const sidebarIconClick = (event) => {
        const id = event.currentTarget.id;
        const className = event.currentTarget.className.split(" ")[1];
        const parentElement = event.currentTarget.parentElement;

        if(currentIconID !== null) {
            const prevElement = document.getElementById(`${currentIconID}`);
            const prevElementClassName = prevElement.className.split(" ")[1];

            switch(prevElementClassName) {
                case 'default-icon':
                    prevElement.style.borderRadius = '30px';
                    prevElement.style.backgroundColor = 'rgb(49, 51, 56)';
                    
                    if(prevElement.id != 'direct-message-icon') {
                        prevElement.style.color = 'rgb(80, 163, 97)';
                    }
                    
                    break;
                case 'user-icon':
                    const userElement = prevElement.querySelector('img');
                    userElement.style.borderRadius = '30px';
                    break;
            }

            const prevElementHoverIndicator = prevElement.parentElement.querySelector('.sidebar-icon-hover-indicator');
            prevElementHoverIndicator.style.height = '20px';
            prevElementHoverIndicator.style.visibility = 'hidden';
        }

        setCurrentIconID(id);

        switch(className) {
            case 'default-icon':
                const defaultElement = event.currentTarget;
                defaultElement.style.borderRadius = '15px';
                if(id == 'direct-message-icon') {
                    defaultElement.style.backgroundColor = 'rgb(90, 100, 234)';
                } else {
                    defaultElement.style.backgroundColor = 'rgb(80, 163, 97)';
                    defaultElement.style.color = 'white';
                }
                break;
            case 'user-icon':
                const userElement = event.currentTarget.querySelector('img');
                userElement.style.borderRadius = '15px';
                break;
        }

        switch(id) {
            case 'add-server-icon':
                setIsAddServerVisible(true);
                break;
            case 'download-apps-icon':
                setIsDownloadAppsVisible(true);
                break;
        }

        const hoverIndicator = parentElement.querySelector('.sidebar-icon-hover-indicator');
        hoverIndicator.style.transition = 'all 0.1s';
        hoverIndicator.style.height = '40px';
        setHoverIndicatorVisible(true);
    }

    const sidebarIconMouseOver = (event) => {
        const parentElement = event.currentTarget.parentElement;
        
        const hoverIndicator = parentElement.querySelector('.sidebar-icon-hover-indicator');
        hoverIndicator.style.visibility = 'visible';

        const overlayText = parentElement.querySelector('.overlay-text');
        overlayText.style.marginLeft = `${overlayText.offsetWidth + 80}px`;
        if(overlayText.offsetWidth > 200) {
            overlayText.style.whiteSpace = 'wrap';
        }
        overlayText.style.visibility = 'visible';
    }

    const sidebarIconMouseOut = (event) => {
        const parentElement = event.currentTarget.parentElement;
        
        const hoverIndicator = parentElement.querySelector('.sidebar-icon-hover-indicator');
        
        if(hoverIndicatorVisible && event.currentTarget.id == currentIconID) {
            hoverIndicator.style.visibility = 'visible';
        } else {
            hoverIndicator.style.visibility = 'hidden';
        }

        const overlayText = parentElement.querySelector('.overlay-text');
        overlayText.style.visibility = 'hidden';
    }

    return (
        <div className='sidebar-component'>
            <div className='sidebar-icon-container'>
                <div className='sidebar-icon-hover-indicator' style={{visibility: 'hidden'}}></div>
                <div className='overlay-text' style={{visibility: 'hidden'}}>
                    <p>Direct Messages</p>
                </div>
                <div className='sidebar-icon default-icon' id='direct-message-icon' onClick={sidebarIconClick} onMouseOver={sidebarIconMouseOver} onMouseOut={sidebarIconMouseOut}>
                    <FontAwesomeIcon icon={faDiscord} />
                </div>
            </div>

            <hr />

            {serverList.map((server, index) => (
                <div className='sidebar-icon-container' key={index}>
                    <div className='sidebar-icon-hover-indicator' style={{visibility: 'hidden'}}></div>
                    <div className='overlay-text' style={{visibility: 'hidden'}}>
                        <p>{server[0]}</p>
                    </div>
                    <div className='sidebar-icon user-icon' id={server[0]} onClick={sidebarIconClick} onMouseOver={sidebarIconMouseOver} onMouseOut={sidebarIconMouseOut}>
                        <img src={server[1]} />
                    </div>
                </div>
            ))}

            <div className='sidebar-icon-container'>
                <div className='sidebar-icon-hover-indicator' style={{visibility: 'hidden'}}></div>
                <div className='overlay-text' style={{visibility: 'hidden'}}>
                    <p>Add a Server</p>
                </div>
                <div className='sidebar-icon default-icon' id='add-server-icon' onClick={sidebarIconClick} onMouseOver={sidebarIconMouseOver} onMouseOut={sidebarIconMouseOut}>
                    <FontAwesomeIcon icon={faPlus} />
                </div>
            </div>

            <div className='sidebar-icon-container'>
                <div className='sidebar-icon-hover-indicator' style={{visibility: 'hidden'}}></div>
                <div className='overlay-text' style={{visibility: 'hidden'}}>
                    <p>Explore Discoverable Servers</p>
                </div>
                <div className='sidebar-icon default-icon' id='explore-servers-icon' onClick={sidebarIconClick} onMouseOver={sidebarIconMouseOver} onMouseOut={sidebarIconMouseOut}>
                    <FontAwesomeIcon icon={faCompass} />
                </div>
            </div>

            <hr />

            <div className='sidebar-icon-container'>
                <div className='sidebar-icon-hover-indicator' style={{visibility: 'hidden'}}></div>
                <div className='overlay-text' style={{visibility: 'hidden'}}>
                    <p>Download Apps</p>
                </div>
                <div className='sidebar-icon default-icon' id='download-apps-icon' onClick={sidebarIconClick} onMouseOver={sidebarIconMouseOver} onMouseOut={sidebarIconMouseOut}>
                    <FontAwesomeIcon icon={faDownload} />
                </div>
            </div>

            {isAddServerVisible && <AddServer userId={userId} fetchData={fetchData} onClose={() => {setIsAddServerVisible(false)}} /> }

            {isDownloadAppsVisible && <DownloadApps onClose={() => {setIsDownloadAppsVisible(false)}} />}
        </div>
    )
}