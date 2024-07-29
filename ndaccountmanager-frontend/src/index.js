import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.render(
    <MsalProvider instance={msalInstance}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </MsalProvider>,
    document.getElementById('root')
);
