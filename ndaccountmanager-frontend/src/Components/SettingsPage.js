import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMsal } from '@azure/msal-react';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { graphConfig } from '../authConfig';
import Header from './Header';
import './SettingsPage.css';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
    const { instance, accounts } = useMsal();
    const [organizationInfo, setOrganizationInfo] = useState([]);
    const [activeTab, setActiveTab] = useState('settings');
    const [userName, setUserName] = useState('');
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrganizationInfo = async () => {
            const request = {
                scopes: ["User.Read", "Group.Read.All"],
                account: accounts[0],
            };

            try {
                const response = await instance.acquireTokenSilent(request);
                const graphResponse = await fetch(graphConfig.graphOrganizationEndpoint, {
                    headers: {
                        Authorization: `Bearer ${response.accessToken}`,
                    },
                });
                const orgData = await graphResponse.json();
                console.log("Organization Info: ", orgData);
                setOrganizationInfo(orgData.value);
            } catch (error) {
                if (error instanceof InteractionRequiredAuthError) {
                    instance.acquireTokenPopup(request).then(response => {
                        return fetch(graphConfig.graphOrganizationEndpoint, {
                            headers: {
                                Authorization: `Bearer ${response.accessToken}`,
                            },
                        });
                    }).then(graphResponse => graphResponse.json())
                        .then(orgData => {
                            console.log("Organization Info (Popup): ", orgData);
                            setOrganizationInfo(orgData.value);
                        }).catch(err => {
                            console.error(err);
                        });
                } else {
                    console.error(error);
                }
            }
        };

        fetchOrganizationInfo();
    }, [instance, accounts]);

    useEffect(() => {
        if (accounts && accounts.length > 0) {
            console.log("Accounts: ", accounts);
            setUserName(accounts[0].name);
            localStorage.setItem('userID', accounts[0].localAccountId);
        }
    }, [accounts]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://localhost:5001/api/categories');
                setCategories(response.data);
            } catch (err) {
                setError('Error fetching categories');
                setCategories([]);
            }
        };

        fetchCategories();
    }, []);

    const handleAddCategory = async () => {
        if (!newCategory) return;

        try {
            const response = await axios.post('https://localhost:5001/api/categories', {
                name: newCategory,
            });
            setCategories([...categories, response.data]);
            setNewCategory('');
        } catch (err) {
            setError('Error adding category');
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        console.log('Deleting category with id:', categoryId);
        try {
            await axios.delete(`https://localhost:5001/api/categories/${categoryId}`);
            setCategories(categories.filter(category => category.categoryId !== categoryId));
        } catch (err) {
            if (err.response && err.response.status === 409) {
                setError('This category cannot be deleted because it has associated accounts.');
            } else {
                setError('Error deleting category');
            }
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        navigate(`/${tab}-accounts`);
    };

    return (
        <div className="settings-page">
            <Header activeTab={activeTab} handleTabClick={handleTabClick} userName={userName} />
            <div className="content-settings">
                <div className="user-information">
                    <h2>User Information</h2>
                    <p>Name: {accounts[0]?.name}</p>
                    <p>Email: {accounts[0]?.username}</p>
                    <p>Azure AD ID: {accounts[0]?.localAccountId}</p>
                    {organizationInfo.length > 0 ? (
                        organizationInfo
                            .filter(org => org.displayName !== null)
                            .map((org) => (
                                <p key={org.id}>Role: {org.displayName || "N/A"}</p>
                            ))
                    ) : (
                        <p>No organization data found</p>
                    )}
                </div>
                <div className="category-management">
                    <h3>Manage Categories</h3>
                    <div className="category-list">
                        {categories.length > 0 ? (
                            categories.map(category => (
                                <div className="category-item" key={category.categoryId}>
                                    <span>{category.name}</span>
                                    <button className="delete-button" onClick={() => handleDeleteCategory(category.categoryId)}>🗑</button>
                                </div>
                            ))
                        ) : (
                            <div className="category-item">
                                <span>No categories available</span>
                            </div>
                        )}
                    </div>
                    <div className="category-form">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Input text"
                        />
                        <button onClick={handleAddCategory}>Add Category</button>
                    </div>
                    {error && <p className="error">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
