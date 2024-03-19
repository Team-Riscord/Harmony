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
    //const [activeIcon, setActiveIcon] = useState(null);

    const userId = "CURRENT_USER_ID";

    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:8800/servers");
            setServerList(res.data.map(server => ({ id: server.id, name: server.name, icon: server.serverIcon })));
        } catch(err) {
            console.error("Error fetching server data:", err);
        }
    };

    const joinServer = async (serverId) => {
        try {
            await axios.post("http://localhost:8800/join-server", { userId, serverId });
            alert('Successfully joined the server!');
            // Refresh the server list or update UI
        } catch (error) {
            console.error("Error joining server:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [isAddServerVisible, isDownloadAppsVisible]);

    const toggleVisibility = (component) => {
        if (component === "addServer") {
            setIsAddServerVisible(!isAddServerVisible);
        } else if (component === "downloadApps") {
            setIsDownloadAppsVisible(!isDownloadAppsVisible);
        }
    };

    return (
        <div className='sidebar-component'>
            <div className='sidebar-icon-container' onClick={() => toggleVisibility('addServer')}>
                <div className='sidebar-icon default-icon' id='add-server-icon'>
                    <FontAwesomeIcon icon={faPlus} />
                </div>
            </div>

            <div className='sidebar-icon-container' onClick={() => toggleVisibility('downloadApps')}>
                <div className='sidebar-icon default-icon' id='download-apps-icon'>
                    <FontAwesomeIcon icon={faDownload} />
                </div>
            </div>

            {serverList.map((server, index) => (
                <div key={index} className='sidebar-icon-container' onClick={() => joinServer(server.id)}>
                    <div className='sidebar-icon user-icon' style={{ backgroundImage: `url(${server.icon || 'default_icon_path'})` }}>
                        {}
                    </div>
                    {}
                </div>
            ))}

            {isAddServerVisible && <AddServer onClose={() => setIsAddServerVisible(false)} />}
            {isDownloadAppsVisible && <DownloadApps onClose={() => setIsDownloadAppsVisible(false)} />}
        </div>
    );
}
