import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './components/Signup/Signup';
import Sidebar from './components/SideBar/SideBar'; 
import JoinServer from './components/JoinServer/JoinServer'; // Import the JoinServer component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const setShowJoinServer = useState(false); // State variable to track whether JoinServer should be displayed

  useEffect(() => {
    // Check if user is logged in via local storage
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
  }, []);

  // Function to close JoinServer component
  const closeJoinServer = () => {
    setShowJoinServer(false);
  };

  return (
    <div className="App">
      <BrowserRouter>
        {isLoggedIn && <Sidebar />}
        
        <Routes>
          <Route path="/signup" element={<Signup />} />
          {/* Pass closeJoinServer function to JoinServer component */}
          <Route path="/join-server" element={<JoinServer userId="CURRENT_USER_ID" onClose={closeJoinServer} />} />
          <Route path="/login" element={<LoginComponent setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

// Placeholder login component
const LoginComponent = ({ setIsLoggedIn }) => {
  const handleLogin = () => {
    // Simulate login by setting local storage
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  return (
    <div>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
};

export default App;
