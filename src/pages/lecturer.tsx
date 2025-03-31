import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Input, Button, Text, Textarea, Table } from '@chakra-ui/react';
import { Applicant } from '@/types/types';
import { dummyApplicants } from "@/data/dummyApplicants";

interface CustomFormControlProps {
    error?: string;
    children: React.ReactNode;
}
const CustomFormControl: React.FC<CustomFormControlProps> = ({ error, children }) => (
    <Box>
        {children}
        {error && <Text color="red.500" fontSize="sm">{error}</Text>}
    </Box>
);

const LecturerPage: React.FC = () => {
    // Use dummy applicants for initial state
    const [applicants, setApplicants] = useState<Applicant[]>(dummyApplicants);

    // State to track validation errors for applicants by id
    const [errors, setErrors] = useState<{
        [id: number]: { rank?: string; comment?: string };
    }>({});

    // Load saved applicants from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('applicants');
        if (saved) {
            setApplicants(JSON.parse(saved));
        }
    }, []);

    // Save applicants state to localStorage when it changes.
    useEffect(() => {
        localStorage.setItem('applicants', JSON.stringify(applicants));
    }, [applicants]);

    // Toggle Selection for Applicant
    const toggleSelect = (id: number) => {
        setApplicants((prev) =>
            prev.map((app) =>
                app.id === id ? {...app, selected: !app.selected} : app
            )
        );
    };

    /* Update rank and comments for selected applicants
       Overloaded functions to enforce types for rank and comments

       Validation:
            Rank: Must be a positive number.
            Comments: Must not exceed 200 characters.
     */
    function updateApplicantDetails(id: number, key: "rank", value: number): void;
    function updateApplicantDetails(id: number, key: "comment", value: string): void;
    function updateApplicantDetails(
        id: number,
        key: "rank" | "comment",
        value: number | string
    ): void {
        setApplicants((prev) =>
            prev.map((app) =>
                app.id === id ? { ...app, [key]: value } : app
            )
        );
    }

    // Handle rank changes with validation
    const handleRankChange = (id: number, newValue: string) => {
        const rank = Number(newValue);
        if (rank > 0) {
            // Clear any rank error if valid.
            setErrors((prev) => ({
                ...prev,
                [id]: { ...prev[id], rank: '' }
            }));
            updateApplicantDetails(id, "rank", rank);
        } else {
            // Set error message for invalid rank.
            setErrors((prev) => ({
                ...prev,
                [id]: { ...prev[id], rank: 'Rank must be greater than 0' }
            }));
        }
    };

    // Handle comment changes with validation.
    const handleCommentChange = (id: number, newValue: string) => {
        if (newValue.length <= 200) {
            // Clear any comment error if valid.
            setErrors((prev) => ({
                ...prev,
                [id]: { ...prev[id], comment: '' }
            }));
            updateApplicantDetails(id, "comment", newValue);
        } else {
            // Set error message for too long comment.
            setErrors((prev) => ({
                ...prev,
                [id]: { ...prev[id], comment: 'Comment cannot exceed 200 characters' }
            }));
        }
    };

    return(
        <Box p={4}>
            <Heading mb={4}>Lecturer Dashboard</Heading>

            {/* Applicants List */}
            <Box mb={8}>
                <Heading size="md" mb={2}>Applicants</Heading>
                <Table.Root size="sm">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Name</Table.ColumnHeader>
                            <Table.ColumnHeader>Course</Table.ColumnHeader>
                            <Table.ColumnHeader>Availability</Table.ColumnHeader>
                            <Table.ColumnHeader>Skills</Table.ColumnHeader>
                            <Table.ColumnHeader>Credentials</Table.ColumnHeader>
                            <Table.ColumnHeader>Action</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {applicants.map((applicant) => (
                            <Table.Row key={applicant.id}>
                                <Table.Cell>{applicant.name}</Table.Cell>
                                <Table.Cell>{applicant.course}</Table.Cell>
                                <Table.Cell>{applicant.availability}</Table.Cell>
                                <Table.Cell>{applicant.skills.join(", ")}</Table.Cell>
                                <Table.Cell>{applicant.academicCredentials}</Table.Cell>
                                <Table.Cell>
                                    <Button size="sm"
                                            colorScheme={applicant.selected ? 'red' : 'green'}
                                            onClick={() => toggleSelect(applicant.id)}>
                                        {applicant.selected ? 'Deselect' : 'Select'}
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Box>

            {/* Applicants Ranking and Comments */}
            <Box>
                <Heading size="md" mb={2}>Selected Applicants</Heading>
                {applicants.filter((app) => app.selected).length === 0 ? (
                    <Text>No Applicants Selected, Please choose to proceed.</Text>
                ) : (
                    applicants
                        .filter((app) => app.selected)
                        .map((applicant) => (
                            <Box
                                key={applicant.id}
                                p={4}
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
                                    <CustomFormControl error={errors[applicant.id]?.rank}>
                                        <Input
                                            type="number"
                                            value={applicant.rank || ""}
                                            onChange={(e) => handleRankChange(applicant.id, e.target.value)}
                                            maxW="80px"
                                        />
                                    </CustomFormControl>
                                </Flex>
                                <CustomFormControl error={errors[applicant.id]?.comment}>
                                    <Textarea
                                        placeholder="Enter Applicant comments..."
                                        value={applicant.comment || ""}
                                        onChange={(e) => handleCommentChange(applicant.id, e.target.value)}
                                        size="sm"
                                    />
                                </CustomFormControl>
                            </Box>
                        ))
                )}
            </Box>
        </Box>
    );
};

export default LecturerPage;