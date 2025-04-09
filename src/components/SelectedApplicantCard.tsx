"use client";

import React from "react";
import { Box, Flex, Heading, Text, Input, Textarea } from "@chakra-ui/react";
import { Applicant } from "@/types/types";
import CustomFormControl from "./CustomFormControl";
import { useUserLookup } from "@/utils/userLookup";

interface SelectedApplicantCardProps {
    applicant: Applicant;
    error?: { rank?: string; comment?: string };
    handleRankChange: (id: string, newValue: string) => void;
    handleCommentChange: (id: string, newValue: string) => void;
}

const SelectedApplicantCard: React.FC<SelectedApplicantCardProps> = ({
        applicant,
        error,
        handleRankChange,
        handleCommentChange,
    }) => {
    // Call the useUserLookup hook at the top level.
    const userLookup = useUserLookup();

    // Helper function for getting users name from the lookup.
    const getUserName = (applicantId: string): string => {
        const user = userLookup[applicantId];
        return user ? `${user.firstName} ${user.lastName}` : applicantId;
    };

    return (
        <Box mt={8}
             p={4}
             border="1px solid"
             borderWidth="1px"
             borderColor="gray.200"
             borderRadius="md"
             boxShadow="md"
             mb={4}
        >
            <Heading size="sm" mb={4}>
                {getUserName(applicant.applicantId)} - {applicant.course}
            </Heading>
            <Flex align="center" mb={2}>
                <Text mr={2}>Rank:</Text>
                <CustomFormControl error={error?.rank}>
                    <Input type="number"
                           value={applicant.rank || ""}
                           onChange={(e) => handleRankChange(applicant.id, e.target.value)}
                           maxW="80px"
                    />
                </CustomFormControl>
            </Flex>
            <CustomFormControl error={error?.comment}>
                <Textarea placeholder="Enter applicant comments..."
                          value={
                              Array.isArray(applicant.comment)
                                  ? applicant.comment.join(" ")
                                  : applicant.comment || ""
                          }
                          onChange={(e) => handleCommentChange(applicant.id, e.target.value)}
                          size="sm"
                />
            </CustomFormControl>
        </Box>
    );
};

export default SelectedApplicantCard;
