import React from 'react';
import { Box, Heading, Text, Flex, VStack } from '@chakra-ui/react';
import { Applicant } from '@/types/types';

interface VisualRepresentationProps {
    applicants: Applicant[];
}

const VisualRepresentation: React.FC<VisualRepresentationProps> =({ applicants }) => {
    // Filter applicants by ranking
    const selectedApplicants = applicants.filter(app => app.selected && app.rank !== undefined);

    // Applicant with the lowest rank(most selected/ranked)
    const mostSelectedApplicant = selectedApplicants.length > 0
        ? selectedApplicants.reduce((prev, curr) => (prev.rank! < curr.rank! ? prev : curr))
        : null;

    // Applicant with the highest rank (least selected/ranked)
    const leastSelectedApplicant = selectedApplicants.length > 0
        ?selectedApplicants.reduce((prev, curr) => (prev.rank! > curr.rank! ? prev: curr))
        : null;

    // Applicants not selected
    const notSelectedApplicant = applicants.filter(app => !app.selected);

    return (
        <Box mt={8} p={4} border="1px solid" borderColor="gray.300" borderRadius="md">
            <Heading size="md" mb={4}>Applicants Overview</Heading>
            <Flex justify="space-around" align="flex-start">
                <VStack flex="1">
                    <Heading size="sm">Most Chosen Applicant</Heading>
                    {mostSelectedApplicant ? (
                        <Box p={2} borderWidth="1px" borderRadius="md" w="100%" textAlign="center">
                            <Text fontWeight="bold">{mostSelectedApplicant.name}</Text>
                            <Text>Rank: {mostSelectedApplicant.rank}</Text>
                        </Box>
                    ) : (
                        <Text>No applicant selected</Text>
                    )}
                </VStack>
                <VStack flex="1">
                    <Heading size="sm">Least Chosen</Heading>
                    {leastSelectedApplicant ? (
                        <Box p={2} borderWidth="1px" borderRadius="md" w="100%" textAlign="center">
                            <Text fontWeight="bold">{leastSelectedApplicant.name}</Text>
                            <Text>Rank: {leastSelectedApplicant.rank}</Text>
                        </Box>
                    ) : (
                        <Text>No applicant selected.</Text>
                    )}
                </VStack>
                <VStack flex="1">
                    <Heading size="sm">Not Selected</Heading>
                    {notSelectedApplicant.length > 0 ? (
                        notSelectedApplicant.map(applicant => (
                            <Box key={applicant.id} p={2} borderWidth="1px" borderRadius="md" w="100%" textAlign="center">
                                <Text>{applicant.name}</Text>
                            </Box>
                        ))
                    ) : (
                        <Text>All applicants have been selected.</Text>
                    )}
                </VStack>
            </Flex>
        </Box>
    );
};

export default VisualRepresentation;