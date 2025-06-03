"use client";

import React from "react";
import { Box, Heading, Text, Flex, VStack, Avatar } from "@chakra-ui/react";
import { ApplicationUI } from "@/types/applicationTypes";
import { useUserLookup } from "@/utils/userLookup";

interface VisualRepresentationProps {
    applications: ApplicationUI[];
}

const VisualRepresentation: React.FC<VisualRepresentationProps> = ({
                                                                       applications,
                                                                   }) => {
    // Now this hook returns Record<number, UserUI>
    const userLookup = useUserLookup();

    // Accept a number directly and index userLookup[number]
    const getUserName = (userId: number): string => {
        const user = userLookup[userId];
        return user ? `${user.firstName} ${user.lastName}` : String(userId);
    };

    // Build a map from numeric userId → count of selected apps
    const userCounts: Record<number, number> = {};
    applications.forEach((app) => {
        const uid = app.user.id; // a number
        if (!(uid in userCounts)) {
            userCounts[uid] = 0;
        }
        if (app.selected) {
            userCounts[uid] += 1;
        }
    });

    // Split into “selected at least once” vs “never selected”
    const selectedEntries = Object.entries(userCounts)
        .filter(([_, count]) => count > 0)
        // Convert back to [number, count]
        .map(([uid, count]) => [Number(uid), count] as [number, number]);

    const notSelectedEntries = Object.entries(userCounts)
        .filter(([_, count]) => count === 0)
        .map(([uid, _]) => Number(uid));

    // Find max/min among those with at least one selection
    let maxCount = 0;
    let minCount = Infinity;
    if (selectedEntries.length > 0) {
        maxCount = Math.max(...selectedEntries.map(([, count]) => count));
        minCount = Math.min(...selectedEntries.map(([, count]) => count));
    }

    // Which userIds have that max/min?
    const mostSelectedUserIds = selectedEntries
        .filter(([uid, count]) => count === maxCount)
        .map(([uid]) => uid);

    const leastSelectedUserIds = selectedEntries
        .filter(([uid, count]) => count === minCount)
        .map(([uid]) => uid);

    return (
        <Box mt={8} p={4} border="1px solid" borderColor="gray.300" borderRadius="md">
            <Heading size="md" mb={4}>
                Applicants Overview
            </Heading>
            <Flex justify="space-around" align="flex-start">
                {/* Most Selected Users */}
                <VStack flex="1">
                    <Heading as="h3" size="sm">
                        Most Selected User(s)
                    </Heading>
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
                                    <Avatar.Image src={userLookup[uid]?.avatar ?? undefined}
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
                                    <Avatar.Image src={userLookup[uid]?.avatar ?? undefined}
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
                        notSelectedEntries.map((uid) => (
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
                                    <Avatar.Image src={userLookup[uid]?.avatar ?? undefined}
                                                  mb={2}/>
                                </Avatar.Root>
                                <Text fontWeight="bold">{getUserName(uid)}</Text>
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
