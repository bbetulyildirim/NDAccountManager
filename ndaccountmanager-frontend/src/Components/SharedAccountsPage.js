import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMsal } from '@azure/msal-react';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import Header from './Header';
import './SharedAccountsPage.css';
import { useNavigate } from 'react-router-dom';
import { FaClipboard } from 'react-icons/fa';

const SharedAccountsPage = () => {
    const { instance, accounts } = useMsal();
    const [sharedAccounts, setSharedAccounts] = useState([]);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('shared');
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

        const fetchSharedAccounts = async () => {
            try {
                const userId = await fetchUserId();
                if (!userId) {
                    setError("User ID not found.");
                    return;
                }

                const response = await axios.get(`https://localhost:5001/api/accounts/GetSharedAccountsByUserId/${userId}`);
                setSharedAccounts(response.data);
                setFilteredAccounts(response.data);
            } catch (err) {
                setError('Error fetching shared accounts');
            }
        };

        fetchSharedAccounts();
    }, [instance, accounts]);

    useEffect(() => {
        const results = sharedAccounts.filter(account =>
            account.account.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.account.notes.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredAccounts(results);
    }, [searchTerm, sharedAccounts]);

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
        <div className="shared-accounts-page">
            <Header activeTab={activeTab} handleTabClick={handleTabClick} userName={accounts[0]?.name} />
            <div className="content-homepage">
                <div className="page-header">
                    <h2>Shared Accounts</h2>
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
                                <th>Share Type</th>
                                <th>Expiration Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAccounts.length > 0 ? (
                                filteredAccounts.map(account => (
                                    <tr key={account.shareId}>
                                        <td>{account.account.category ? account.account.category.name : 'N/A'}</td>
                                        <td>{account.account.platform}</td>
                                        <td>{account.account.username}</td>
                                        <td className="password-cell">
                                            <span
                                                className="hidden-password"
                                                onMouseEnter={() => handleMouseEnter(account.account.password)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                {visiblePassword === account.account.password ? account.account.password : '••••••••'}
                                            </span>
                                            <FaClipboard className="copy-icon" onClick={() => copyToClipboard(account.account.password)} />
                                        </td>
                                        <td>{account.account.notes}</td>
                                        <td>{account.shareType}</td>
                                        <td>{account.expirationDate ? new Date(account.expirationDate).toLocaleDateString() : 'N/A'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">No shared accounts available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SharedAccountsPage;
