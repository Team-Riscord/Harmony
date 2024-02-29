import './Riscord.css';

import Sidebar from './Sidebar';

export default function Riscord({ emailOrUsername }) {
    return (
        <div className='riscord-page'>
            <Sidebar emailOrUsername={emailOrUsername} />
        </div>
    )
}