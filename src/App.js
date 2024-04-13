import React, { useState } from 'react';
import HomePage from './HomePage';
import ChatPage from './ChatPage';
import AboutUsPage from './AboutUsPage';

const Page = {
    HOME: "home",
    CHAT: "chat",
    ABOUT: "about",
};

const App = () => {
    const [currentPage, setCurrentPage] = useState(Page.HOME);

    const navigateTo = (page) => {
        setCurrentPage(page);
    };

    const renderPage = () => {
        switch (currentPage) {
            case Page.CHAT:
                return <ChatPage />;
            case Page.ABOUT:
                return <AboutUsPage navigateTo={navigateTo} />;
            default:
                return <HomePage navigateTo={navigateTo} />;
        }
    };

    return (
        <div>
            {renderPage()}
        </div>
    );
};

export default App;
