import React from 'react';

const DownloadApps = ({ onClose }) => {
    return (
        <div>
            <h2>Download Apps</h2>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default DownloadApps;