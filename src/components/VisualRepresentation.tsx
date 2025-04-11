"use client";

import React from "react";
import {Box, Heading, Text, Flex, VStack, Avatar} from "@chakra-ui/react";
import { Applicant } from "@/types/types";
import { useUserLookup } from "@/utils/userLookup";

interface VisualRepresentationProps {
    applicants: Applicant[];
}

const VisualRepresentation: React.FC<VisualRepresentationProps> = ({ applicants }) => {
    // Get user data once from the custom hook.
    const userLookup = useUserLookup();

    // Helper function to get a user's full name from the lookup.
    const getUserName = (userId: string): string => {
        const user = userLookup[userId];
        return user ? `${user.firstName} ${user.lastName}` : userId;
    };

    // Build an object mapping each userId (i.e. user) to the count of selected applications.
    const userCounts: Record<string, number> = {};
    applicants.forEach((app) => {
        if (!(app.userId in userCounts)) {
            userCounts[app.userId] = 0;
        }
        if (app.selected) {
            userCounts[app.userId] += 1;
        }
    });

    // Separate users by whether they have been selected at all.
    const selectedEntries = Object.entries(userCounts).filter(([_, count]) => count > 0);
    const notSelectedEntries = Object.entries(userCounts).filter(([_, count]) => count === 0);

    // Determine the highest and lowest count among users with at least one selection.
    let maxCount = 0;
    let minCount = Infinity;
    if (selectedEntries.length > 0) {
        maxCount = Math.max(...selectedEntries.map(([_, count]) => count));
        minCount = Math.min(...selectedEntries.map(([_, count]) => count));
    }

    // Get arrays of user IDs matching the most and least selected counts.
    const mostSelectedUserIds = selectedEntries
        .filter(([uid, count]) => count === maxCount)
        .map(([uid]) => uid);
    const leastSelectedUserIds = selectedEntries
        .filter(([uid, count]) => count === minCount)
        .map(([uid]) => uid);

    return (
        <Box mt={8} p={4} border="1px solid" borderColor="gray.300" borderRadius="md">
            <Heading size="md" mb={4}>Applicants Overview</Heading>
            <Flex justify="space-around" align="flex-start">
                {/* Most Selected Users */}
                <VStack flex="1">
                    <Heading as="h3">Most Selected User(s)</Heading>
                    {mostSelectedUserIds.length > 0 ? (
                        mostSelectedUserIds.map((uid) => (
                            <Box
                                key={uid}
                                p={3}
                                borderWidth="1px"
                                borderRadius="md"
                                w="90%"
                                textAlign="center"
                                minH="130px"
                            >
                                {/* Avatar for the user */}
                                <Avatar.Root>
                                    <Avatar.Image src={userLookup[uid]?.avatar}
                                              mb={2}/>
                                </Avatar.Root>
                                <Text fontWeight="bold">{getUserName(uid)}</Text>
                                <Text>
                                    Selected in {maxCount} course{maxCount > 1 ? "s" : ""}
                                </Text>
                            </Box>
                        ))
                    ) : (
                        <Text>No users with selections found.</Text>
                    )}
                </VStack>

                {/* Least Selected Users */}
                <VStack flex="1">
                    <Heading as="h3">Least Selected User(s)</Heading>
                    {leastSelectedUserIds.length > 0 ? (
                        leastSelectedUserIds.map((uid) => (
                            <Box
                                key={uid}
                                p={3}
                                borderWidth="1px"
                                borderRadius="md"
                                w="90%"
                                textAlign="center"
                                minH="130px"
                            >
                                <Avatar.Root>
                                    <Avatar.Image src={userLookup[uid]?.avatar}
                                                  mb={2}/>
                                </Avatar.Root>
                                <Text fontWeight="bold">{getUserName(uid)}</Text>
                                <Text>
                                    Selected in {minCount} course{minCount > 1 ? "s" : ""}
                                </Text>
                            </Box>
                        ))
                    ) : (
                        <Text>No users with selections found.</Text>
                    )}
                </VStack>

                {/* Not Selected Users */}
                <VStack flex="1">
                    <Heading as="h3">Not Selected</Heading>
                    {notSelectedEntries.length > 0 ? (
                        notSelectedEntries.map(([uid]) => (
                            <Box
                                key={uid}
                                p={3}
                                borderWidth="1px"
                                borderRadius="md"
                                w="90%"
                                textAlign="center"
                                minH="130px"
                            >
                                <Avatar.Root>
                                    <Avatar.Image src={userLookup[uid]?.avatar}
                                                  mb={2}/>
                                </Avatar.Root>
                                <Text>{getUserName(uid)}</Text>
                            </Box>
                        ))
                    ) : (
                        <Text>All users have at least one selection.</Text>
                    )}
                </VStack>
            </Flex>
        </Box>
    );
};

export default VisualRepresentation;
