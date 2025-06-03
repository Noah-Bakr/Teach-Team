import React, { useEffect, useState } from 'react';
import { Avatar, Menu, Portal } from "@chakra-ui/react";
import "../styles/Navbar.css";
import LoginForm from './LoginForm';
import { useRouter } from 'next/router';
import SignUpForm from './SignUpForm';
import { UserUI } from '@/types/userTypes';
import { getCurrentUser, logoutUser } from '@/services/authService';
import { fetchUserById } from '@/services/userService';

const Navbar: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<UserUI | null>(null);
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
        logoutUser();
    };

    // Fetch current user from /auth/me
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await getCurrentUser();

                const user: UserUI = {
                    id: response.id,
                    username: response.username,
                    firstName: response.firstName,
                    lastName: response.lastName,
                    email: response.email,
                    avatar: response.avatar || null,
                    role: response.role || "candidate",
                    skills: response.skills || [],
                    courses: response.courses || [],
                    previousRoles: response.previousRoles || [],
                    academicCredentials: response.academicCredentials || [],
                };
                setCurrentUser(user);
                console.log("Current avatar fetched:", user.avatar);
            } catch (error) {
                const status = (error as { response?: { status?: number } }).response?.status;

                if (status === 401) {
                    setCurrentUser(null); // Not logged in — this is okay
                } else {
                    console.error("Unexpected error fetching user:", error);
                }
            }
        };

        fetchCurrentUser();
    }, []);

    return (
        <div>
            <nav className="navbar">
                <ul className="nav-list">
                    <li>
                        <Menu.Root>
                            <Menu.Trigger>
                                <Avatar.Root colorPalette="yellow" size={"xl"} >
                                    <Avatar.Fallback />
                                    <Avatar.Image src={currentUser?.avatar || undefined}/>
                                </Avatar.Root>
                            </Menu.Trigger>
                            <Portal>
                                <Menu.Positioner>
                                    <Menu.Content>
                                        {currentUser === null ? (
                                            <>
                                                <Menu.Item value="sign-in" onClick={handleLoginClick}>Sign In</Menu.Item>
                                                <Menu.Item value="sign-up" onClick={handleSignUpClick}>Sign Up</Menu.Item>
                                            </>
                                        ) : (
                                            <>
                                                <Menu.Item value="dashboard" onClick={() => { router.push("/dashboard"); }}>Dashboard</Menu.Item>
                                                <Menu.Item value="profile" onClick={() => { router.push("/profile"); }}>Profile</Menu.Item>
                                                <Menu.Item value="sign-out" color="fg.error" _hover={{ bg: "bg.error", color: "fg.error" }} onClick={handleSignOutClick}>Sign Out</Menu.Item>
                                            </>
                                        )}
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