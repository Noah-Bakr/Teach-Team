import React from 'react';
import Link from 'next/link';
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li>
                    <Link href="/sign-up">Sign Up</Link>
                </li>
                <li>
                    <Link href="/sign-in">Sign In</Link>
                </li>
                <li>
                    <Link href="/sign-out">Sign Out</Link>
                </li>
            </ul>
        </nav>
    )
}
export default Navbar;