import React from "react";
import { Box, Flex, Heading, Text, Input, Textarea } from "@chakra-ui/react";
import { Applicant } from "@/testData/types";
import CustomFormControl from "./CustomFormControl";

interface SelectedApplicantCardProps {
    applicant: Applicant;
    error?: { rank?: string; comment?: string };
    handleRankChange: (id: number, newValue: string) => void;
    handleCommentChange: (id: number, newValue: string) => void;
}

const SelectedApplicantCard: React.FC<SelectedApplicantCardProps> = ({
        applicant,
        error,
        handleRankChange,
        handleCommentChange,
    }) => (
    <Box p={4}
         border="1px solid"
         borderColor="gray.200"
         borderRadius="md"
         mb={4}
         >
        <Heading size="sm" mb={2}>
            {applicant.name} - {applicant.course}
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
                      value={applicant.comment || ""}
                      onChange={(e) => handleCommentChange(applicant.id, e.target.value)}
                      size="sm"
            />
        </CustomFormControl>
    </Box>
);

export default SelectedApplicantCard;
