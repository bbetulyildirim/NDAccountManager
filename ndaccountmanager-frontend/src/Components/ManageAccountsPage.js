import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Modal from 'react-modal';
import { FaClipboard } from 'react-icons/fa';
import './ManageAccountsPage.css';

Modal.setAppElement('#root');

const ManageAccountsPage = () => {
    const [activeTab, setActiveTab] = useState('manage');
    const navigate = useNavigate();
    const { instance, accounts } = useMsal();
    const [userName, setUserName] = useState('');
    const [userAccounts, setUserAccounts] = useState([]);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [shareType, setShareType] = useState('Unlimited');
    const [shareWith, setShareWith] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [newAccount, setNewAccount] = useState({ platform: '', username: '', password: '', notes: '', category: '' });

    useEffect(() => {
        if (accounts && accounts.length > 0) {
            setUserName(accounts[0].name);
        }
    }, [accounts]);

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

    useEffect(() => {
        const fetchUserAccounts = async () => {
            try {
                const userId = await fetchUserId();
                if (!userId) {
                    setError("User ID not found.");
                    return;
                }

                const response = await axios.get(`https://localhost:5001/api/accounts/GetAccountsByUserId/${userId}`);
                setUserAccounts(response.data);
            } catch (err) {
                setError('Error fetching user accounts');
            }
        };

        fetchUserAccounts();
    }, [instance, accounts]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        navigate(`/${tab}-accounts`);
    };

    const handleOpenModal = (account) => {
        setSelectedAccount(account);
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
    };

    const handleOpenAddModal = () => {
        setAddModalIsOpen(true);
    };

    const handleCloseAddModal = () => {
        setAddModalIsOpen(false);
    };

    const handleAddAccount = async () => {
        try {
            const userId = await fetchUserId();
            if (!userId) {
                setError("User ID not found.");
                return;
            }

            const response = await axios.post('https://localhost:5001/api/accounts/AddAccount', {
                userId,
                ...newAccount,
            });

            setUserAccounts([...userAccounts, response.data]);
            handleCloseAddModal();
        } catch (err) {
            setError('Error adding account');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Password copied to clipboard');
    };

    return (
        <div className="manage-accounts-page">
            <Header activeTab={activeTab} handleTabClick={handleTabClick} userName={userName} />
            <div className="content-manage">
                <h2>Manage Accounts</h2>
                {error && <p className="error">{error}</p>}
                <div className="search-form">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search accounts"
                    />
                    <button className="search-button">Search</button>
                    <button className="add action-btn" onClick={handleOpenAddModal}>Add Account</button>
                </div>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Platform</th>
                                <th>Username</th>
                                <th>Password</th>
                                <th>Notes</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userAccounts.length > 0 ? (
                                userAccounts.map(account => (
                                    <tr key={account.accountId}>
                                        <td>{account.category ? account.category.name : 'N/A'}</td>
                                        <td>{account.platform}</td>
                                        <td>{account.username}</td>
                                        <td className="password-cell">
                                            <span className="hidden-password">••••••••</span>
                                            <span className="visible-password">{account.password}</span>
                                            <FaClipboard className="copy-icon" onClick={() => copyToClipboard(account.password)} />
                                        </td>
                                        <td>{account.notes}</td>
                                        <td className="actions">
                                            <button className="share action-btn" onClick={() => handleOpenModal(account)}>Share</button>
                                            <button className="edit action-btn">Edit</button>
                                            <button className="delete action-btn">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No accounts available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Share Account"
                className="modal-content"
                overlayClassName="overlay-content"
            >
                <h2>Share Account</h2>
                {selectedAccount && (
                    <form>
                        <div className="form-group">
                            <label>Platform:</label>
                            <input type="text" value={selectedAccount.platform} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Username:</label>
                            <input type="text" value={selectedAccount.username} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Share Type:</label>
                            <select value={shareType} onChange={(e) => setShareType(e.target.value)}>
                                <option value="Unlimited">Unlimited</option>
                                <option value="Limited">Limited</option>
                            </select>
                        </div>
                        {shareType === 'Limited' && (
                            <div className="form-group">
                                <label>Expiration Date:</label>
                                <input type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
                            </div>
                        )}
                        <div className="form-group">
                            <label>Share With:</label>
                            <input type="text" value={shareWith} onChange={(e) => setShareWith(e.target.value)} />
                        </div>
                        <div className="form-actions">
                            <button>Share</button>
                            <button onClick={handleCloseModal}>Close</button>
                        </div>
                    </form>
                )}
            </Modal>
            <Modal
                isOpen={addModalIsOpen}
                onRequestClose={handleCloseAddModal}
                contentLabel="Add Account"
                className="modal-content"
                overlayClassName="overlay-content"
            >
                <h2>Add Account</h2>
                <div className="form-group">
                    <label>Platform:</label>
                    <input type="text" value={newAccount.platform} onChange={(e) => setNewAccount({ ...newAccount, platform: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Username:</label>
                    <input type="text" value={newAccount.username} onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" value={newAccount.password} onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Notes:</label>
                    <textarea value={newAccount.notes} onChange={(e) => setNewAccount({ ...newAccount, notes: e.target.value })}></textarea>
                </div>
                <div className="form-group">
                    <label>Category:</label>
                    <input type="text" value={newAccount.category} onChange={(e) => setNewAccount({ ...newAccount, category: e.target.value })} />
                </div>
                <div className="form-actions">
                    <button onClick={handleAddAccount}>Add</button>
                    <button onClick={handleCloseAddModal}>Close</button>
                </div>
            </Modal>
        </div>
    );
};

export default ManageAccountsPage;
