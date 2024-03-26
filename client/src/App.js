import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/DashBoard/DashBoard';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Homepage from './components/Homepage/Homepage';
import JoinServer from './components/JoinServer/JoinServer'; // Import JoinServer component

function App() {
  const isLoggedIn = !!localStorage.getItem('userData');

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join-server" element={<JoinServer />} /> {/* Render JoinServer route */}
          {isLoggedIn ? (
            <Route path="/dashboard" element={<Dashboard />} />
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;