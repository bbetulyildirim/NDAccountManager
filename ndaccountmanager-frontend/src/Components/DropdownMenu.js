import React from "react";
import { useMsal } from "@azure/msal-react";
import { Dropdown } from "react-bootstrap";
import './DropdownMenu.css';

const DropdownMenu = ({ userName }) => {
    const { instance } = useMsal();

    const handleLogout = () => {
        instance.logoutRedirect({
            postLogoutRedirectUri: "http://localhost:3000",
        });
    };

    return (
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                👤 {userName || "Staff Name"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="/manageaccounts"> 💼 Manage Accounts</Dropdown.Item>
                <Dropdown.Item href="/settings">🔧 Settings</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>🚪 Logout</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default DropdownMenu;
