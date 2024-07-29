import React from 'react';
import './HomePage.css';
import Header from './Header';
import { useMsal } from '@azure/msal-react';

const HomePage = () => {
    const { accounts } = useMsal();
    const userName = accounts[0] && accounts[0].name;

    const activeTab = 'home';

    return (
        <div className="container-homepage">
            <Header activeTab={activeTab} handleTabClick={() => { }} userName={userName} />
            <div className="content-homepage">
                <h1 className="welcome-message">🎉Welcome <span className="highlight">{userName}🎉</span>!</h1>
                <div className="info-message">
                    <p>👤 From the <span className="highlight">Personal Accounts</span> page, you can access your own accounts.</p>
                    <p>📢 On the <span className="highlight">Shared Accounts</span> page, you can view accounts shared with you.</p>
                    <p>💼 Using the menu in the upper right corner, you can navigate to the <span className="highlight">Manage Accounts</span> page to manage your accounts,</p>
                    <p>🔧 and go to the <span className="highlight">Settings</span> page to update your user information and add categories, and <span className="highlight">log out</span>.</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
