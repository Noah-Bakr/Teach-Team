import React, { useState } from 'react';
import { Box, Flex, Heading, Input, Button, Text, Textarea, Table } from '@chakra-ui/react';
import { Applicant } from '../types';
import { dummyApplicants } from "../data/dummyApplicants";

const LecturerPage: React.FC = () => {
    const [applicants, setApplicants] = useState<Applicant[]>(dummyApplicants);


    // Toggle Selection for Applicant
    const toggleSelect = (id: number) => {
        setApplicants((prev) =>
            prev.map((app) =>
                app.id === id ? {...app, selected: !app.selected} : app
            )
        );
    };

    /* Update rank and comments for selected applicants
       Overloaded functions to enforce types for rank and comments */
    function updateApplicantDetails(id: number, key: "rank", value: number): void;
    function updateApplicantDetails(id: number, key: "comment", value: string): void;
    function updateApplicantDetails(
        id: number,
        key: "rank" | "comment",
        value: number | string
    ): void {
        setApplicants((prev) =>
            prev.map((app) => (app.id === id ? { ...app, [key]: value } : app))
        );
    }

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
                            <Box key={applicant.id}
                                 p={4}
                                 border="1px solid"
                                 borderColor="grey.200"
                                 mb={4}
                            >
                                <Heading size="sm" mb={2}>
                                    {applicant.name} - {applicant.course}
                                </Heading>
                                <Flex align="center" mb={2}>
                                    <Text mr={2}>Rank:</Text>
                                    <Input type="number"
                                           value={applicant.rank || ""}
                                           onChange={(e) =>
                                               updateApplicantDetails(
                                                   applicant.id,
                                                   "rank",
                                                   Number(e.target.value)
                                               )
                                            }
                                           maxW="80px"
                                    />
                                </Flex>
                                <Textarea placeholder="Enter Applicant comments..."
                                          value={applicant.comments || ""}
                                          onChange={(e) =>
                                              updateApplicantDetails(applicant.id, "comment", e.target.value)
                                          }
                                          size="sm"
                                />
                            </Box>
                        )))}
            </Box>
        </Box>
    );
};

export default LecturerPage;