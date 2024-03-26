import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DownloadApps = () => {
  const [apps, setApps] = useState([]);

  // Fetch the list of downloadable apps from the server
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await axios.get('/api/apps'); // Assuming '/api/apps' is the endpoint to fetch apps
        setApps(response.data);
      } catch (error) {
        console.error('Error fetching apps:', error);
      }
    };

    fetchApps();
  }, []);

  return (
    <div className="download-apps">
      <h2>Download Apps</h2>
      <ul>
        {apps.map(app => (
          <li key={app.id}>
            <a href={app.downloadLink} target="_blank" rel="noopener noreferrer">{app.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DownloadApps;
