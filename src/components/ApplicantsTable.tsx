import React from 'react';
import { Button, Table } from '@chakra-ui/react';
import { Applicant } from '@/types/types';
import { useUserLookup } from "@/utils/userLookup";
import { useCourseLookup } from "@/utils/courseLookup";

interface ApplicantsTableProps {
    applicants: Applicant[];
    toggleSelect: (id: string) => void;
}

const ApplicantsTable: React.FC<ApplicantsTableProps> = ({ applicants, toggleSelect}) => {
    // Call the useUserLookup hook at the top level.
    const userLookup = useUserLookup();

    // Helper function that uses the lookup to get a user's full name.
    const getUserName = (applicantId: string): string => {
        const user = userLookup[applicantId];
        return user ? `${user.firstName} ${user.lastName}` : applicantId;
    };

    // Call the useCourseLookup hook at the top level.
    const courseLookup = useCourseLookup();

    // Helper function that uses the lookup to get a course name.
    const getCourseName = (courseId: string): string => {
        const course = courseLookup[courseId];
        // If found, return the course name; otherwise fallback to the courseId
        return course ? course.name : courseId;
    };

    return (
        <Table.Root colorScheme="gray" borderRadius="md" boxShadow="md">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Course Code</Table.ColumnHeader>
                    <Table.ColumnHeader>Course Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Availability</Table.ColumnHeader>
                    <Table.ColumnHeader>Skills</Table.ColumnHeader>
                    <Table.ColumnHeader>Credentials</Table.ColumnHeader>
                    <Table.ColumnHeader>Action</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {applicants.map((applicant) => (
                    <Table.Row key={applicant.id}>
                        {/* Use the getUserName to display the full name */}
                        <Table.Cell>{getUserName(applicant.userId)}</Table.Cell>
                        <Table.Cell>{applicant.courseId}</Table.Cell>
                        {/* Use the getCourseName to display courseName */}
                        <Table.Cell>{getCourseName(applicant.courseId)}</Table.Cell>
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
};

export default ApplicantsTable;