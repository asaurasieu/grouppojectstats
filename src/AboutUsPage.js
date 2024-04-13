import React from 'react';
import backgroundImage from './restimg1.jpg';

const backgroundStyle = {
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};
// Assuming navigateTo is passed as a prop
const AboutUsPage = ({ navigateTo }) => (
    <div style={backgroundStyle}>
    <div style={{fontFamily: "Andale Mono"}}>
        <h1>WELCOME TO REC-STAURANT</h1>
        
      <h2>LEARN MORE ABOUT US</h2>
      <h2>Goal</h2>
      <ul>
        <li>The goal of the restaurant recommendation chatbot is to provide users with personalized and relevant restaurant recommendations based on their preferences, location, and other relevant factors.</li>
        <li>The chatbot aims to simplify the process of finding a suitable restaurant for users, saving them time and effort in the decision-making process.</li>
        <li>Additionally, the goal may include fostering a positive user experience and encouraging users to explore new dining options.</li>
      </ul>
      <h2>Vision</h2>
      <ul>
        <li>Our vision is to become the go-to platform for individuals seeking restaurant recommendations, offering a seamless and enjoyable experience that exceeds user expectations.</li>
        <li>We envision a future where our chatbot is widely used and trusted by users to discover great dining experiences tailored to their tastes and preferences.</li>
        <li>Furthermore, we aspire to continually innovate and enhance our chatbot's capabilities, leveraging cutting-edge technology to provide even more personalized and insightful recommendations.</li>
      </ul>
      <h2>Mission</h2>
      <ul>
        <li>Our mission is to revolutionize the way people discover and explore restaurants by leveraging artificial intelligence and natural language processing technology.</li>
        <li>We aim to empower users to make informed dining decisions while fostering a sense of discovery and excitement about trying new culinary experiences.</li>
        <li>Additionally, we strive to create a community where users can share their dining experiences, contribute feedback, and connect with others who share similar tastes and interests.</li>
        </ul>
        
        <button
            style={{ position: 'absolute', right: '20px' }}
            onClick={() => navigateTo('home')}
        >
            Return to Home
        </button>

        </div>
        </div>
    
    
);

export default AboutUsPage;