"use client";
import React from "react";
import { Button, Table } from "@chakra-ui/react";
import { ApplicationUI } from "@/types/applicationTypes";

interface ApplicantsTableProps {
    applications: ApplicationUI[];
    toggleSelect: (id: number) => void;
}

const ApplicantsTable: React.FC<ApplicantsTableProps> = ({
                                                             applications,
                                                             toggleSelect,
                                                         }) => {
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
                {applications.map((application) => (
                    <Table.Row key={application.id}>
                        {/* Display full user name via lookup */}
                        <Table.Cell>
                            {application.user.firstName} {application.user.lastName}
                        </Table.Cell>

                        {/* Course code and name directly from ApplicationUI */}
                        <Table.Cell>{application.course.code}</Table.Cell>
                        <Table.Cell>{application.course.name}</Table.Cell>

                        {/* Availability is a single string in ApplicationUI */}
                        <Table.Cell>{application.availability}</Table.Cell>

                        {/* Join the skills array into a comma-separated string */}
                        <Table.Cell>
                            {application.user.skills.length > 0
                                ? application.user.skills.join(", ")
                                : "—"}
                        </Table.Cell>

                        {/* Join the academic credentials array */}
                        <Table.Cell>
                            {application.user.academicCredentials.length > 0
                                ? application.user.academicCredentials.join(", ")
                                : "—"}
                        </Table.Cell>

                        {/* “Select” / “Deselect” button */}
                        <Table.Cell>
                            <Button
                                variant="solid"
                                size="sm"
                                bg="#fddf49"
                                onClick={() => toggleSelect(application.id)}
                            >
                                {application.selected ? "Deselect" : "Select"}
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
};

export default ApplicantsTable;
