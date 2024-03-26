import React from 'react';
import SideBar from '../SideBar/SideBar';
import './DashBoard.css';

function Dashboard() {
  return (
    <div className="DashBoard">
      <SideBar />
      <div className="main-content">
      </div>
    </div>
  );
}

export default Dashboard;