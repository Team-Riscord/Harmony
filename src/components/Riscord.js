import './Riscord.css';

import Sidebar from './Sidebar';
import DMServerBar from './DMServerBar';

export default function Riscord() {
    return (
        <div className='riscord-page'>
            <Sidebar style={{gridColumn: 1}}/>
            <DMServerBar style={{gridColumn: 2}}/>
        </div>
    )
}