import {Box, Button, Flex, Heading, Text} from "@chakra-ui/react"
import {CreamCard} from "@/components/CreamCard";
import { toaster } from "@/components/ui/toaster";
import { useState } from "react";
import LoginForm from '@/components/LoginForm';
import SignUpForm from "@/components/SignUpForm";

export default function Home() {
    // State variables for login
    const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
    const handleLoginClick = () => {
        setIsLoginFormOpen(true);
    };
    const closeLoginForm = () => {
        setIsLoginFormOpen(false);
    };

    // State variables for sign up
    const [isSignUpFormOpen, setIsSignUpFormOpen] = useState(false);
    const handleSignUpClick = () => {
        setIsSignUpFormOpen(true);
    };
    const closeSignUpForm = () => {
        setIsSignUpFormOpen(false);
    };

  return (
     <Box position="relative" >
            {/* Main Content */}
            <Box as="main" p={3}>
                <Flex direction="column" align="center" textAlign="center">
                    <CreamCard>
                        <Heading my={3}>Welcome to TeachTeam</Heading>
                        <Text fontSize="xl" maxW="800px">
                            TeachTeam is a dedicated web system designed to streamline the selection and
                            hiring of casual tutors at the School of Computer Science. Whether you are a tutor
                            applicant filling out a comprehensive profile or a lecturer reviewing candidates,
                            TeachTeam makes the process efficient and transparent.
                        </Text>
                        <Flex gap={4} mt={3} justify="center">
                                <Button as="a" style={{ backgroundColor: '#fddf49' }} onClick={handleSignUpClick}>
                                    Sign Up
                                </Button>

                                <Button as="a" style={{ backgroundColor: '#fddf49' }} onClick={handleLoginClick}>
                                    Sign In
                                </Button>
                        </Flex>
                    </CreamCard>
                </Flex>
                <Box mt={8} maxW="800px" mx="auto">
                    <Flex direction={["column", "row"]} gap={8}>
                        <Box flex="1">
                            <CreamCard>
                               <Heading size="md" mb={3}>For Tutor Applicants</Heading>
                               <Text>
                                   Build a detailed profile that highlights your academic achievements, relevant
                                   skills, and any previous teaching or tutoring experience. Our intuitive application
                                   form ensures that your qualifications are fully represented.
                               </Text>
                            </CreamCard>
                        </Box>
                        <Box flex="1">
                            <CreamCard>
                               <Heading size="md" mb={3}>For Lecturers</Heading>
                               <Text>
                                   Quickly review and assess tutor applications. With features to rank, comment,
                                   and select candidates based on your detailed analysis, TeachTeam helps you
                                   make well‑informed hiring decisions.
                               </Text>
                            </CreamCard>
                        </Box>
                    </Flex>
                </Box>
            </Box>
            {isLoginFormOpen && <LoginForm closeForm={closeLoginForm} />}
            {isSignUpFormOpen && <SignUpForm closeForm={closeSignUpForm} />}
     </Box>
   );
}