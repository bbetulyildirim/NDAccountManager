import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMsal } from '@azure/msal-react';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import Header from './Header';
import './PersonalAccountsPage.css';
import { useNavigate } from 'react-router-dom';
import { FaClipboard } from 'react-icons/fa';

const PersonalAccountsPage = () => {
    const { instance, accounts } = useMsal();
    const [personalAccounts, setPersonalAccounts] = useState([]);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('personal');
    const [searchTerm, setSearchTerm] = useState('');
    const [visiblePassword, setVisiblePassword] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserId = async () => {
            const request = {
                scopes: ["User.Read"],
                account: accounts[0],
            };

            try {
                const response = await instance.acquireTokenSilent(request);
                const userIdResponse = await axios.get(`https://localhost:5001/api/users/GetUserIdByAzureAdId/${accounts[0].localAccountId}`, {
                    headers: {
                        Authorization: `Bearer ${response.accessToken}`,
                    },
                });
                return userIdResponse.data;
            } catch (error) {
                if (error instanceof InteractionRequiredAuthError) {
                    const response = await instance.acquireTokenPopup(request);
                    const userIdResponse = await axios.get(`https://localhost:5001/api/users/GetUserIdByAzureAdId/${accounts[0].localAccountId}`, {
                        headers: {
                            Authorization: `Bearer ${response.accessToken}`,
                        },
                    });
                    return userIdResponse.data;
                } else {
                    console.error(error);
                }
            }
        };

        const fetchPersonalAccounts = async () => {
            try {
                const userId = await fetchUserId();
                if (!userId) {
                    setError("User ID not found.");
                    return;
                }

                const response = await axios.get(`https://localhost:5001/api/accounts/GetAccountsByUserId/${userId}`);
                setPersonalAccounts(response.data);
                setFilteredAccounts(response.data);
            } catch (err) {
                setError('Error fetching personal accounts');
            }
        };

        fetchPersonalAccounts();
    }, [instance, accounts]);

    useEffect(() => {
        const results = personalAccounts.filter(account =>
            account.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (account.category ? account.category.name.toLowerCase().includes(searchTerm.toLowerCase()) : false)
        );
        setFilteredAccounts(results);
    }, [searchTerm, personalAccounts]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        navigate(`/${tab}-accounts`);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Password copied to clipboard');
    };

    const handleMouseEnter = (password) => {
        setVisiblePassword(password);
    };

    const handleMouseLeave = () => {
        setVisiblePassword(null);
    };

    const handleSearch = (e) => {
        e.preventDefault();
    };

    return (
        <div className="personal-accounts-page">
            <Header activeTab={activeTab} handleTabClick={handleTabClick} userName={accounts[0]?.name} />
            <div className="content-homepage">
                <div className="page-header">
                    <h2>My Accounts</h2>
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-button">Search</button>
                    </form>
                </div>
                {error && <p className="error">{error}</p>}
                <div className="table-container-homepage">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Platform</th>
                                <th>Username</th>
                                <th>Password</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAccounts.length > 0 ? (
                                filteredAccounts.map(account => (
                                    <tr key={account.accountId}>
                                        <td>{account.category ? account.category.name : 'N/A'}</td>
                                        <td>{account.platform}</td>
                                        <td>{account.username}</td>
                                        <td className="password-cell">
                                            <span
                                                className="hidden-password"
                                                onMouseEnter={() => handleMouseEnter(account.password)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                {visiblePassword === account.password ? account.password : '••••••••'}
                                            </span>
                                            <FaClipboard className="copy-icon" onClick={() => copyToClipboard(account.password)} />
                                        </td>
                                        <td>{account.notes}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No personal accounts available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PersonalAccountsPage;
