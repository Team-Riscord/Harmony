import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './DMServerBar.css';

import { faUser, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function DMServerBar() {

    const DMTitleMouseOverText = (event) => {
        event.currentTarget.parentElement.querySelector('.serverbar-middle-DM-title-overlay-text').style.visibility = 'visible';
    }

    const DMTitleMouseOutText = (event) => {
        event.currentTarget.parentElement.querySelector('.serverbar-middle-DM-title-overlay-text').style.visibility = 'hidden';
    }

    return (
        <div className='serverbar-component'>
            <div className='serverbar-top'>
                <button>Find or Start a Conversation</button>
            </div>
            <div className='serverbar-middle'>
                <div className='serverbar-middle-default-buttons'>
                    <div className='serverbar-middle-default-button' id='serverbar-middle-friends-button'>
                        <div className='serverbar-middle-default-button-icon'>
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                        <div className='serverbar-middle-default-button-title'>
                            <p>friends</p>
                        </div>
                    </div>
                </div>
                <div className='serverbar-middle-DM-buttons'>
                    <div className='serverbar-middle-DM-title'>
                        <div className='serverbar-middle-DM-title-text'>
                            <p>direct messages</p>
                        </div>
                        <div className='serverbar-middle-DM-title-icon' onMouseOver={DMTitleMouseOverText} onMouseOut={DMTitleMouseOutText}>
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                        <div className='serverbar-middle-DM-title-overlay-text' style={{visibility: 'hidden'}}>
                            <p>Create DM</p>
                        </div>
                    </div>
                    <div className='serverbar-middle-DM-button-section'>
                        <div className='serverbar-middle-DM-button'>
                            <div className='serverbar-middle-DM-button-icon'>
                                <img src='' />
                            </div>
                            <div className='serverbar-middle-DM-button-title'>
                                <p>Test User</p>
                            </div>
                            <div className='serverbar-middle-DM-button-close'></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='serverbar-bottom'>

            </div>
        </div>
    )
}