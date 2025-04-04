import React from 'react';
import { Button, Table } from '@chakra-ui/react';
import { Applicant } from '@/testData/types';

interface ApplicantsTableProps {
    applicants: Applicant[];
    toggleSelect: (id: number) => void;
}

const ApplicantsTable: React.FC<ApplicantsTableProps> = ({ applicants, toggleSelect}) => (
    <Table.Root colorScheme="gray" borderRadius="md" boxShadow="md">
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
                        <Button variant="solid"
                                size="sm"
                                colorScheme={applicant.selected ? 'red' : 'green'}
                                onClick={() => toggleSelect(applicant.id)}>
                            {applicant.selected ? 'Deselect' : 'Select'}
                        </Button>
                    </Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table.Root>
);

export default ApplicantsTable;