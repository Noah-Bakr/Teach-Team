import {Box, Button, Flex, Heading, Stack, Text} from "@chakra-ui/react"
import {CreamCard} from "@/components/CreamCard";
import Link from "next/link";

//     src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />



export default function Home() {


  return (
     <Box position="relative" height="100vh">
            {/* Main Content */}
            <Box as="main" p={4}>
               <CreamCard>
                    <Flex direction="column" align="center" textAlign="center">
                        <Heading my={4}>Welcome to TeachTeam</Heading>
                        <Text fontSize="xl" maxW="800px">
                            TeachTeam is a dedicated web system designed to streamline the selection and
                            hiring of casual tutors at the School of Computer Science. Whether you are a tutor
                            applicant filling out a comprehensive profile or a lecturer reviewing candidates,
                            TeachTeam makes the process efficient and transparent.
                        </Text>
                        <Flex gap={4} mt={6} justify="center">
                            {/*TODO Noah to add sign in and sign up button login*/}
                                <Button as="a" style={{ backgroundColor: '#fddf49' }}>
                                    Sign Up
                                </Button>

                                <Button as="a" style={{ backgroundColor: '#fddf49' }}>
                                    Sign In
                                </Button>

                        </Flex>
                    </Flex>
                   <Box mt={12} maxW="800px" mx="auto">
                       <Flex direction={["column", "row"]} gap={8}>
                           <Box flex="1">
                               <Heading size="md" mb={3}>For Tutor Applicants</Heading>
                               <Text>
                                   Build a detailed profile that highlights your academic achievements, relevant
                                   skills, and any previous teaching or tutoring experience. Our intuitive application
                                   form ensures that your qualifications are fully represented.
                               </Text>
                           </Box>
                           <Box flex="1">
                               <Heading size="md" mb={3}>For Lecturers</Heading>
                               <Text>
                                   Quickly review and assess tutor applications. With features to rank, comment,
                                   and select candidates based on your detailed analysis, TeachTeam helps you
                                   make well‑informed hiring decisions.
                               </Text>
                           </Box>
                       </Flex>
                   </Box>
               </CreamCard>
            </Box>
     </Box>
   
   );
}