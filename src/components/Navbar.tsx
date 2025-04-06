import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@chakra-ui/react";
import "../styles/Navbar.css";
import LoginForm from './LoginForm';

const Navbar: React.FC = () => {
    const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);

    const handleLoginClick = () => {
        setIsLoginFormOpen(true);
    };

    const closeLoginForm = () => {
        setIsLoginFormOpen(false);
    };

    return (
        <div>
            <nav className="navbar">
                <ul className="nav-list">
                    <li>
                        <Link href="/sign-up">Sign Up</Link>
                    </li>
                    <li>
                        <Button onClick={handleLoginClick}>Log In</Button>
                    </li>
                    <li>
                        <Link href="/sign-out">Sign Out</Link>
                    </li>
                </ul>
            </nav>
            {isLoginFormOpen && <LoginForm closeForm={closeLoginForm} />}
        </div>
        
    )
}
export default Navbar;