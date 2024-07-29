import React, { useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { instance } = useMsal();
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add('login-page');
        return () => {
            document.body.classList.remove('login-page');
        };
    }, []);

    const handleLogin = () => {
        instance.loginPopup(loginRequest).then(response => {
            navigate('/home');
        }).catch(e => {
            console.error(e);
        });
    };

    return (
        <button className="login-button" onClick={handleLogin}>
        </button>
    );
};

export default Login;
