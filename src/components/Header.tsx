import React from 'react';
import '../styles/Header.css';
import Navbar from "./Navbar";
import Link from 'next/link';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="header-container">
                <Link href="/" className="site-title">TeachTeam</Link>
                <Navbar />
            </div>
        </header>
    )
}

export default Header;