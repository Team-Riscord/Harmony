import './DownloadApps.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faApple, faWindows, faLinux, faGooglePlay, faAppStoreIos } from '@fortawesome/free-brands-svg-icons';

import { useState } from 'react';

export default function DownloadApps({ onClose }) {

    return (
        <div className='download-apps-component'>
            <div className='download-apps-close-icon-container'>
                <FontAwesomeIcon icon={faXmark} id='download-apps-close-icon' onClick={() => {onClose()}} />
            </div>
            <div className='download-apps-title'>
                <h1>Get Riscord at Home</h1>
            </div>
            <div className='download-apps-container DA-container-1'>
                <div className='download-apps-card-container'>
                    <div className='download-apps-card' style={{gridColumn: '1'}}>
                        <div>
                            <FontAwesomeIcon icon={faApple} className='DA-card-image' />
                        </div>
                        <div>
                            <h2 className='DA-card-title'>MacOS</h2>
                        </div>
                        <div>
                            <button className='DA-card-button' onClick={() => {window.open('https://discord.com/api/download?platform=osx', '_blank')}}>Download</button>
                        </div>
                    </div>
                    <div className='download-apps-card' style={{gridColumn: '2'}}>
                        <div>
                            <FontAwesomeIcon icon={faWindows} className='DA-card-image' />
                        </div>
                        <div>
                            <h2 className='DA-card-title'>Windows</h2>
                        </div>
                        <div>
                            <button className='DA-card-button' onClick={() => {window.open('https://discord.com/api/download?platform=win', '_blank')}}>Download</button>
                        </div>
                    </div>
                    <div className='download-apps-card' style={{gridColumn: '3'}}>
                        <div>
                            <FontAwesomeIcon icon={faLinux} className='DA-card-image' />
                        </div>
                        <div>
                            <h2 className='DA-card-title'>Linux</h2>
                        </div>
                        <div className='DA-linux-card'>
                            <button className='DA-card-button DA-linux-button' onClick={() => {window.open('https://discord.com/api/download?platform=linux&format=deb', '_blank')}}>Deb</button>
                            <button className='DA-card-button DA-linux-button' onClick={() => {window.open('https://discord.com/api/download?platform=linux&format=tar.gz', '_blank')}}>Tar</button>
                        </div>
                    </div>
                </div>
                <div className='download-apps-title' style={{margin: '20px 0'}}>
                    <h1>Or on the go</h1>
                </div>
                <div className='download-apps-card-container DA-container-2'>
                    <div className='download-apps-card' style={{gridColumn: '1'}}>
                        <div>
                            <FontAwesomeIcon icon={faAppStoreIos} className='DA-card-image' />
                        </div>
                        <div>
                            <h2 className='DA-card-title'>Apple iOS</h2>
                        </div>
                        <div>
                            <button className='DA-card-button' onClick={() => {window.open('https://itunes.apple.com/app/discord/id985746746', '_blank')}}>Download</button>
                        </div>
                    </div>
                    <div className='download-apps-card' style={{gridColumn: '2'}}>
                        <div>
                            <FontAwesomeIcon icon={faGooglePlay} className='DA-card-image' />
                        </div>
                        <div>
                            <h2 className='DA-card-title'>Android</h2>
                        </div>
                        <div>
                            <button className='DA-card-button' onClick={() => {window.open('https://play.google.com/store/apps/details?id=com.discord', '_blank')}}>Download</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='download-apps-latest-link'>
                <p>Want some of that fresh off-the-vine Riscord? <a href="https://discord.com/download#ptb-card" target="_blank">Get the public test build</a>.</p>
            </div>
        </div>
    )
}