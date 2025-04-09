import React from 'react';
import '../styles/Header.css';
import Navbar from "./Navbar";

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="header-container">
                <a href="/" className="site-title">TeachTeam</a>
                <Navbar />
            </div>
        </header>
    )
}

export default Header;