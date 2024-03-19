import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './components/Signup/Signup';
import Sidebar from './components/SideBar/SideBar'; // Ensure this is correctly imported

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in via local storage
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        {isLoggedIn && <Sidebar />}
        
        <Routes>
          <Route path="/signup" element={<Signup />} />
          {/* Assuming this route will be for the login page */}
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
