import React from 'react';
import Link from 'next/link';
import { Button } from "@chakra-ui/react";
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
    return (
        <div>
            <nav className="navbar">
                <ul className="nav-list">
                    <li>
                        <Link href="/sign-up">Sign Up</Link>
                    </li>
                    <li>
                        <Button>Log In</Button>
                    </li>
                    <li>
                        <Link href="/sign-out">Sign Out</Link>
                    </li>
                </ul>
            </nav>
        </div>
        
    )
}
export default Navbar;