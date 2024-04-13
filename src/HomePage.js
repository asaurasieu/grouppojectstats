// HomePage.js
import React from 'react';
import './HomePage.css';

const HomePage = ({ navigateTo }) => {
    return (
        <div className="homepage-container">
            <div className="links">
                <button onClick={() => navigateTo('about')}>About Us</button>
            </div>
            <h1 className="title">WELCOME TO THE</h1>
            <h2 className="h2">REC-STAURANT</h2>
            <button className="start-chat-button" onClick={() => navigateTo('chat')}>
                Start ChatBot
            </button>

        </div>
    );
};

export default HomePage;
