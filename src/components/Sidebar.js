import './Sidebar.css';

import AddServer from './AddServer';
import DownloadApps from './DownloadApps';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCompass, faDownload } from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';

import { useEffect, useState } from 'react';

import { ref, get } from 'firebase/database';

import db from '../utils/firebase';

export default function Sidebar({ username }) {
    const [isAddServerVisible, setIsAddServerVisible] = useState(false);
    const [isDownloadAppsVisible, setIsDownloadAppsVisible] = useState(false);
    const [serverList, setServerList] = useState([]);
    const [userId, setUserId] = useState(null);
    const [activeIcon, setActiveIcon] = useState(null);

    const fetchData = async () => {
        const tempList = [];
        const snapshot = await get(ref(db, 'users/'));
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            if (data.username === username) {
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

            // const closedIDs = ['add-server-icon', 'download-apps-icon'];
            // for(const serverId in closedIDs) {
            //     setActiveIcon(null);
            //     const addServerElem = document.getElementById(closedIDs[serverId]);
            //     const addServerHoverIndicator = addServerElem.parentElement.querySelector('.sidebar-icon-hover-indicator');
            //     addServerElem.style.borderRadius = '30px';
            //     addServerElem.style.backgroundColor = 'rgb(49, 51, 56)';
            //     addServerElem.style.color = 'rgb(80, 163, 97)';
            //     addServerHoverIndicator.style.height = '20px';
            //     addServerHoverIndicator.style.visibility = 'hidden';
            // }
        }

        fetchData();
    }, [username, userId, isAddServerVisible, isDownloadAppsVisible]);

    const sidebarIconClick = (event) => {
        setActiveIcon(event.currentTarget.id);

        const parentElem = event.currentTarget.parentElement;
        
        if(activeIcon != null) {
            const previousElem = document.getElementById(`${activeIcon}`);
            const previousElemParent = previousElem.parentElement;
            const iconElem = previousElemParent.querySelector('.sidebar-icon');
            
            switch(iconElem.className.split(' ')[1]) {
                case 'default-icon':
                    iconElem.style.borderRadius = '30px';
                    iconElem.style.backgroundColor = 'rgb(49, 51, 56)';
                    if(activeIcon == 'direct-message-icon') {
                        iconElem.style.color = 'white';
                    } else {
                        iconElem.style.color = 'rgb(80, 163, 97)';
                    }

                    break;
                case 'user-icon':
                    iconElem.querySelector('img').style.borderRadius = '30px';
                    break;
            }

            const hoverIndicator = previousElemParent.querySelector('.sidebar-icon-hover-indicator');
            hoverIndicator.style.height = '20px';
            hoverIndicator.style.visibility = 'hidden';
        }

        switch(event.currentTarget.className.split(" ")[1]) {
            case 'default-icon':
                event.currentTarget.style.borderRadius = '15px';

                if(event.currentTarget.id == 'direct-message-icon') {
                    event.currentTarget.style.backgroundColor = 'rgb(90, 100, 234)';
                } else {
                    event.currentTarget.style.backgroundColor = 'rgb(80, 163, 97)'; 
                }
                
                event.currentTarget.style.color = 'white';
                
                break;
            case 'user-icon':
                event.currentTarget.querySelector('img').style.borderRadius = '15px';
                break;
        }

        switch(event.currentTarget.id) {
            case 'add-server-icon':
                setIsAddServerVisible(true);
                break;
            case 'download-apps-icon':
                setIsDownloadAppsVisible(true);
                break;
        }

        parentElem.querySelector('.sidebar-icon-hover-indicator').style.height = '40px';
        parentElem.querySelector('.sidebar-icon-hover-indicator').style.visibility = 'visible';

        parentElem.querySelector('.overlay-text').style.visibility = 'hidden';
    }

    const sidebarIconMouseOver = (event) => {
        const parentElem = event.currentTarget.parentElement;

        const overlayText = parentElem.querySelector('.overlay-text');
        overlayText.style.marginLeft = `${overlayText.offsetWidth + 80}px`;
        if(overlayText.offsetWidth > 200) {
            overlayText.style.whiteSpace = 'wrap';
        }
        overlayText.style.visibility = 'visible';
        
        if(activeIcon != event.currentTarget.id) {
            const hoverIndicator = parentElem.querySelector('.sidebar-icon-hover-indicator');
            hoverIndicator.style.visibility = 'visible';
        }
    }

    const sidebarIconMouseOut = (event) => {
        const parentElem = event.currentTarget.parentElement;

        const overlayText = parentElem.querySelector('.overlay-text');
        overlayText.style.visibility = 'hidden';

        if(activeIcon != event.currentTarget.id) {
            const hoverIndicator = parentElem.querySelector('.sidebar-icon-hover-indicator');
            hoverIndicator.style.visibility = 'hidden';
        }
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
                    <div className='sidebar-icon user-icon' id={index} onClick={sidebarIconClick} onMouseOver={sidebarIconMouseOver} onMouseOut={sidebarIconMouseOut}>
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

            {isAddServerVisible && <AddServer userId={userId} fetchData={fetchData} onClose={() => {setIsAddServerVisible(false);}} /> }

            {isDownloadAppsVisible && <DownloadApps onClose={() => {setIsDownloadAppsVisible(false)}} />}
        </div>
    )
}