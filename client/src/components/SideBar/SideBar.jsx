import './SideBar.css';
import AddServer from '../AddServer/AddServer';
import DownloadApps from '../DownloadApps/DownloadApps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faDownload } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Sidebar() {
    const [isAddServerVisible, setIsAddServerVisible] = useState(false);
    const [isDownloadAppsVisible, setIsDownloadAppsVisible] = useState(false);
    const [serverList, setServerList] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("userData"));
            const res = await axios.get(`http://localhost:8800/servers?userId=${userData.id}`);
            setServerList(res.data);
            setError(null); 
        } catch(err) {
            console.error("Error fetching server data:", err);
            setError("Error fetching server data. Please try again later.");
        }
    };

    const joinServer = async (serverId) => {
        try {
            const userData = JSON.parse(localStorage.getItem("userData"));
            const res = await axios.post('http://localhost:8800/join-server', { userId: userData.id, serverId });
            alert(res.data.message);
        } catch (error) {
            console.error("Error joining server:", error);
        }
    };

    const toggleVisibility = (component) => {
        if (component === "addServer") {
            setIsAddServerVisible(!isAddServerVisible);
        } else if (component === "downloadApps") {
            setIsDownloadAppsVisible(!isDownloadAppsVisible);
        }
    };

    const handleAddServer = async (formData) => {
        try {
            const userData = JSON.parse(localStorage.getItem("userData"));
            formData.append('userId', userData.id); // Append user ID to FormData
            const res = await axios.post('http://localhost:8800/add-server', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchData();
            alert(res.data.message);
    
            // Update server list with new server icon
            setServerList(prevServerList => [...prevServerList, res.data.serverData]); // Add new server to server list
            setIsAddServerVisible(false);
        } catch (error) {
            console.error("Error adding server:", error);
        }
    };
    

    return (
        <div className='sidebar-component'>
            <div className='sidebar-top-icons'>
                <div className='sidebar-icon-container' onClick={() => toggleVisibility('addServer')}>
                    <div className='sidebar-icon default-icon' data-testid='add-server-icon'>
                        <FontAwesomeIcon icon={faPlus} />
                    </div>
                </div>
    
                <div className='sidebar-icon-container' onClick={() => toggleVisibility('downloadApps')}>
                    <div className='sidebar-icon default-icon' data-testid='download-apps-icon'>
                        <FontAwesomeIcon icon={faDownload} />
                    </div>
                </div>
            </div>
    
            {error && <div className="error-message">{error}</div>}
    
            {serverList.map((server) => (
                <div key={server.id} className='sidebar-icon-container' onClick={() => joinServer(server.id)}>
                    <div
                        className='sidebar-icon user-icon'
                        style={{ backgroundImage: `url(${server.icon || '/default_icon_path'})` }}
                    ></div>
                </div>
            ))}
    
            {isAddServerVisible && <AddServer onAdd={handleAddServer} onClose={() => setIsAddServerVisible(false)} />}
            {isDownloadAppsVisible && <DownloadApps onClose={() => setIsDownloadAppsVisible(false)} />}
        </div>
    );
}
