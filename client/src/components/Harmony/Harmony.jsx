import './Harmony.css';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';

const Harmony = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userDataFromStorage = JSON.parse(localStorage.getItem('userData'));
        if (!userDataFromStorage) {
            navigate('/login');
        } else {
            setUserData(userDataFromStorage);
        }
    }, [navigate]);

    return (
        <div className='harmony-component'>
            <Sidebar />
        </div>
    )
}

export default Harmony;