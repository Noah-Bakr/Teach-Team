import React from 'react';
import '../styles/Header.css';
import Navbar from "./Navbar";

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="header-container">
                <h1 className="site-title">TeachTeam</h1>
                <Navbar />
            </div>
        </header>
    )
}

export default Header;