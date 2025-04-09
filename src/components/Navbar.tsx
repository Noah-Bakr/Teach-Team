import React, { useState } from 'react';
import Link from 'next/link';
import { Avatar, Button, Menu, Portal } from "@chakra-ui/react";
import "../styles/Navbar.css";
import LoginForm from './LoginForm';
import { useAuth } from '@/context/AuthContext';

const Navbar: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);

    const handleLoginClick = () => {
        setIsLoginFormOpen(true);
    };

    const closeLoginForm = () => {
        setIsLoginFormOpen(false);
    };

    const handleSignOutClick = () => {
        logout();
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
                    <li>
                        <Menu.Root>
                            <Menu.Trigger>
                                <Avatar.Root colorPalette="yellow" size={"2xl"} >
                                    <Avatar.Fallback />
                                    <Avatar.Image src={currentUser?.avatar}/>
                                </Avatar.Root>
                            </Menu.Trigger>
                            <Portal>
                                <Menu.Positioner>
                                    <Menu.Content>
                                        {currentUser === null ? <><Menu.Item value="sign-in" onClick={handleLoginClick}>Sign In</Menu.Item>
                                        <Menu.Item value="sign-up">Sign Up</Menu.Item></> : 
                                        <><Menu.Item value="profile">Profile</Menu.Item>
                                        <Menu.Item value="sign-out" color="fg.error"_hover={{ bg: "bg.error", color: "fg.error" }} onClick={handleSignOutClick}>Sign Out</Menu.Item></>}
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Portal>
                        </Menu.Root>
                    </li>
                </ul>
            </nav>
            {isLoginFormOpen && <LoginForm closeForm={closeLoginForm} />}
        </div>
        
    )
}
export default Navbar;