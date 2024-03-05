import './Riscord.css';

import Sidebar from './Sidebar';

export default function Riscord() {
    const data = JSON.parse(localStorage.getItem('userData'));
    return (
        <div className='riscord-page'>
            <Sidebar username={data.data.username}/>
        </div>
    )
}