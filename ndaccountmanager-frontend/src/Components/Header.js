import React from 'react';
import { useNavigate } from 'react-router-dom';
import DropdownMenu from './DropdownMenu';
import './Header.css';

const Header = ({ activeTab, handleTabClick, userName }) => {
    const navigate = useNavigate();

    return (
        <div className="header-container">
            <header className="header-content">
                <div className="logo" onClick={() => navigate('/home')}>
                    <img src="https://www.nanodems.com/security/wp-content/uploads/2019/06/nanodems_short.png" alt="Logo" />
                </div>
                <div className="tabs">
                    <button
                        className={`tab-link ${activeTab === 'personal' ? 'active' : ''}`}
                        onClick={() => navigate('/personal-accounts')}
                    >
                        Personal Accounts
                    </button>
                    <button
                        className={`tab-link ${activeTab === 'shared' ? 'active' : ''}`}
                        onClick={() => navigate('/shared-accounts')}
                    >
                        Shared Accounts
                    </button>
                </div>
                <div className="user-info">
                    <DropdownMenu userName={userName} />
                </div>
            </header>
        </div>
    );
};

export default Header;
