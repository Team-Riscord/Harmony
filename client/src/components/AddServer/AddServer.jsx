import React from 'react';

const AddServer = ({ onClose }) => {
    return (
        <div>
            <h2>Add Server</h2>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default AddServer;