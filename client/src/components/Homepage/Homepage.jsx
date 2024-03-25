import './Homepage.css';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
    const navigate = useNavigate();

    const goToSignUp = () => {
        navigate('/signup');
        navigate('/signup', { replace: true });
    };

    const goToLogin = () => {
        navigate('/login');
        navigate('/login', { replace: true });
    }

    return (
        <div className='homepage-component'>
            <div className='homepage-container'>
                <div className='homepage-title'>
                    <h1>welcome to <span>harmony</span></h1>
                    <h3>Do something today that your future self will thank you for. The decision is yours!
</h3>
                </div>
                <div className='homepage-description'>
                    <div>
                        <p><span style={{textDecoration: 'underline', color: 'rgb(220, 10, 170)'}}>Harmony</span> is a vibrant, user-friendly <span style={{fontStyle: 'italic', color: 'rgb(68, 15, 198)'}}>Discord</span> clone designed for seamless communication and collaboration. It provides all the essential features needed for chatting, sharing, and connecting with your communities and friends.</p>
                    </div>
                    <div>
                        <p>Whether you're looking to set up a private server for your friends, join public communities, or simply stay in touch with your teams, our instant messaging and VoIP social platform brings the conversation to you, making every interaction memorable.</p>
                    </div>
                </div>
                <div className='homepage-buttons'>
                    <div className='homepage-button'>
                        <button onClick={goToSignUp}>Sign Up</button>
                    </div>
                    <div className='homepage-button'>
                        <button onClick={goToLogin}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Homepage;