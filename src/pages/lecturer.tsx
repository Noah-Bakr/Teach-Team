import React, { useState } from 'react';
import { Box, Flex, Heading, Input, Select, Button, Stack, Text, Textarea, Table } from '@chakra-ui/react';
import { Applicant } from '../types';
import { dummyApplicants } from "../data/dummyApplicants";

const LecturerPage: React.FC = () => {
    const [applicants, setApplicants] = useState<Applicant[]>(dummyApplicants);


    // Toggle Selection for Applicant
    const toggleSelect = (id: number) => {
        setApplicants((prev) =>
            prev.map((app) =>
                app.id === id ? { ...app, selected: !app.selected } : app
            )
        );
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
        </Box>
    )
};

export default LecturerPage;