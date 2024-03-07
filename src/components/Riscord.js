import './Riscord.css';

import Sidebar from './Sidebar';
import DMServerBar from './DMServerBar';

export default function Riscord() {
    const data = JSON.parse(localStorage.getItem('userData'));
    return (
        <div className='riscord-page'>
            <Sidebar username={data.data.username} style={{gridColumn: 1}}/>
            <DMServerBar style={{gridColumn: 2}}/>
        </div>
    )
}