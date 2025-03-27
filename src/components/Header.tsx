import React from 'react';
import '../styles/Header.css';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="header-container">
                <h1 className="site-title">TeachTeam</h1>
            </div>
        </header>
    )
}

export default Header;