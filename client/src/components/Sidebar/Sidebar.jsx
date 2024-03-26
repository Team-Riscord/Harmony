import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCompass, faDownload } from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { useEffect, useState } from 'react';

const Sidebar = () => {
    const sidebarIconMouseOver = (event) => {
        const parentContainer = event.currentTarget.parentElement.parentElement;
        const overlayText = parentContainer.querySelector('.sidebar-overlay-text');
        const hoverIndicator = parentContainer.querySelector('.sidebar-hover-indicator div');

        overlayText.style.visibility = 'visible';

        if(overlayText.offsetWidth > 200) {
            overlayText.style.whiteSpace = 'wrap';
        }
        overlayText.style.visibility = 'visible';

        hoverIndicator.style.visibility = 'visible';
    }

    const sidebarIconMouseOut = (event) => {
        const parentContainer = event.currentTarget.parentElement.parentElement;
        const overlayText = parentContainer.querySelector('.sidebar-overlay-text');
        const hoverIndicator = parentContainer.querySelector('.sidebar-hover-indicator div');

        overlayText.style.visibility = 'hidden';
        hoverIndicator.style.visibility = 'hidden';
    }

    return (
        <div className='sidebar-component'>
            <div className='sidebar-container'>
                <div className='sidebar-overlay-text'>
                    <p>Direct Messages</p>
                </div>
                <div className='sidebar-hover-indicator'>
                    <div></div>
                </div>
                <div className='sidebar-server-icon' id='direct-messages-icon'>
                    <div onMouseOver={sidebarIconMouseOver} onMouseOut={sidebarIconMouseOut}>
                        <FontAwesomeIcon icon={faDiscord} />
                    </div>
                </div>
            </div>

            <div className='sidebar-hr'>
                <hr />
            </div>

            <div className='sidebar-container'>
                <div className='sidebar-overlay-text'>
                    <p>Add A Server</p>
                </div>
                <div className='sidebar-hover-indicator'>
                    <div></div>
                </div>
                <div className='sidebar-server-icon' id='add-server-icon'>
                    <div onMouseOver={sidebarIconMouseOver} onMouseOut={sidebarIconMouseOut}>
                        <FontAwesomeIcon icon={faPlus} />
                    </div>
                </div>
            </div>

            <div className='sidebar-container'>
                <div className='sidebar-overlay-text'>
                    <p>Explore Discoverable Servers</p>
                </div>
                <div className='sidebar-hover-indicator'>
                    <div></div>
                </div>
                <div className='sidebar-server-icon' id='explore-servers-icon'>
                    <div onMouseOver={sidebarIconMouseOver} onMouseOut={sidebarIconMouseOut}>
                        <FontAwesomeIcon icon={faCompass} />
                    </div>
                </div>
            </div>

            <div className='sidebar-hr'>
                <hr />
            </div>

            <div className='sidebar-container'>
                <div className='sidebar-overlay-text'>
                    <p>Download Apps</p>
                </div>
                <div className='sidebar-hover-indicator'>
                    <div></div>
                </div>
                <div className='sidebar-server-icon' id='download-apps-icon'>
                    <div onMouseOver={sidebarIconMouseOver} onMouseOut={sidebarIconMouseOut}>
                        <FontAwesomeIcon icon={faDownload} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;