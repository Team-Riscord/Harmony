import './Homepage.css';

const Homepage = () => {
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
                        <p><span style={{textDecoration: 'underline'}}>Harmony</span> is a vibrant, user-friendly <span style={{fontStyle: 'italic'}}>Discord</span> clone designed for seamless communication and collaboration. It provides all the essential features needed for chatting, sharing, and connecting with your communities and friends.</p>
                    </div>
                    <div>
                        <p>Whether you're looking to set up a private server for your friends, join public communities, or simply stay in touch with your teams, Harmony brings the conversation to you, making every interaction memorable.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Homepage;