import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Components/HomePage';
import Login from './Components/Login';
import SharedAccountsPage from './Components/SharedAccountsPage';
import PersonalAccountsPage from './Components/PersonalAccountsPage';
import ManageAccountsPage from './Components/ManageAccountsPage';
import SettingsPage from './Components/SettingsPage';
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";
import 'bootstrap/dist/css/bootstrap.min.css';

const msalInstance = new PublicClientApplication(msalConfig);

function App() {
    return (
        <MsalProvider instance={msalInstance}>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/shared-accounts" element={<SharedAccountsPage />} />
                    <Route path="/personal-accounts" element={<PersonalAccountsPage />} />
                    <Route path="/manageaccounts" element={<ManageAccountsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Routes>
            </div>
        </MsalProvider>
    );
}

export default App;
