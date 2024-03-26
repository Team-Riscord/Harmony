import React, { useState } from 'react';
import './AddServer.css';
import axios from 'axios';

const AddServer = ({ onAdd, onClose }) => {
    const [serverName, setServerName] = useState('');
    const [serverImage, setServerImage] = useState(null);

    const handleChange = (e) => {
        setServerName(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setServerImage(file);
    };

    const handleAddClick = async () => {
        if (serverName.trim() !== '' && serverImage) {
            try {
                const formData = new FormData();
                formData.append('serverName', serverName);
                formData.append('serverImage', serverImage);

                await axios.post('http://localhost:8800/add-server', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                onAdd(); 
                setServerName('');
                setServerImage(null);
                onClose();
            } catch (error) {
                console.error('Error adding server:', error);
            }
        }
    };

    return (
        <div className='add-server-page'>
            <div className='add-server-container'>
                <div className='add-server-title'>Create a Server</div>
                <div className='add-server-form'>
                    <label className='add-server-form-label'>Server Name</label>
                    <input
                        type='text'
                        className='add-server-form-input'
                        placeholder='Enter server name'
                        value={serverName}
                        onChange={handleChange}
                    />
                    <label className='add-server-form-label'>Server Image</label>
                    <input
                        type='file'
                        className='add-server-form-input'
                        onChange={handleImageChange}
                    />
                </div>
                <div className='add-server-buttons'>
                    <button className='add-server-button add-server-cancel-button' onClick={onClose}>
                        Cancel
                    </button>
                    <button className='add-server-button add-server-create-button' onClick={handleAddClick}>
                        Create
                    </button>
                </div>
            </div>
        </div>
    );    
};

export default AddServer;