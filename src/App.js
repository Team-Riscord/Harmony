import { useEffect, useState } from 'react';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Harmony from './components/Harmony';

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsUserLoggedIn(isLoggedIn);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {isUserLoggedIn && <Route path="/" element={<Harmony />} />}
      </Routes>
    </BrowserRouter>
  );
}

export default App;