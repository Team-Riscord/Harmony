import { useEffect, useState } from 'react';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Homepage from './components/Homepage'; // Import the Homepage component

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Riscord from './components/Harmony';

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsUserLoggedIn(isLoggedIn);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} /> {/* Set Homepage as the default route */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {isUserLoggedIn ? <Route path="/harmony" element={<Riscord />} /> : null}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
