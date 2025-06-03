import React, { useState } from 'react';
import { Avatar, Menu, Portal } from "@chakra-ui/react";
import "../styles/Navbar.css";
import LoginForm from './LoginForm';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import SignUpForm from './SignUpForm';

const Navbar: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const router = useRouter();
    
    // State variables for login
    const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
    const handleLoginClick = () => {
        setIsLoginFormOpen(true);
        setIsSignUpFormOpen(false);
    };
    const closeLoginForm = () => {
        setIsLoginFormOpen(false);
    };

    // State variables for sign up
    const [isSignUpFormOpen, setIsSignUpFormOpen] = useState(false);
    const handleSignUpClick = () => {
        setIsSignUpFormOpen(true);
        setIsLoginFormOpen(false);
    };
    const closeSignUpForm = () => {
        setIsSignUpFormOpen(false);
    };

    const handleSignOutClick = () => {
        logout();
    };

    return (
        <div>
            <nav className="navbar">
                <ul className="nav-list">
                    <li>
                        <Menu.Root>
                            <Menu.Trigger>
                                <Avatar.Root colorPalette="yellow" size={"xl"} >
                                    <Avatar.Fallback />
                                    <Avatar.Image src={currentUser?.avatar ?? undefined}/>
                                </Avatar.Root>
                            </Menu.Trigger>
                            <Portal>
                                <Menu.Positioner>
                                    <Menu.Content>
                                        {currentUser === null ? <><Menu.Item value="sign-in" onClick={handleLoginClick}>Sign In</Menu.Item>
                                        <Menu.Item value="sign-up" onClick={handleSignUpClick}>Sign Up</Menu.Item></> : 
                                        <><Menu.Item value="dashboard" onClick={() => { router.push("/dashboard"); }}>Dashboard</Menu.Item>
                                        <Menu.Item value="profile" onClick={() => { router.push("/profile"); }}>Profile</Menu.Item>
                                        <Menu.Item value="sign-out" color="fg.error" _hover={{ bg: "bg.error", color: "fg.error" }} onClick={handleSignOutClick}>Sign Out</Menu.Item></>}
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Portal>
                        </Menu.Root>
                    </li>
                </ul>
            </nav>
            {isLoginFormOpen && <LoginForm closeForm={closeLoginForm} openSignUpForm={handleSignUpClick}/>}
            {isSignUpFormOpen && <SignUpForm closeForm={closeSignUpForm} />}
        </div>
        
    )
}
export default Navbar;