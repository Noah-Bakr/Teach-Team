"use client";
import React from "react";
import { Button, Table, Drawer, Portal, CloseButton, } from "@chakra-ui/react";
import { ApplicationUI } from "@/types/applicationTypes";
import SelectedApplicantCard from "./SelectedApplicantCard";

interface ApplicantsTableProps {
    applications: ApplicationUI[];
    errors: { [appId: number]: { rank?: string; comment?: string } };
    handleRankChange: (appId: number, newValue: number) => void;
    handleCommentChange: (appId: number, newValue: string) => void;
    allApplications: ApplicationUI[];
}

const ApplicantsTable: React.FC<ApplicantsTableProps> = ({
                                                             applications,
                                                             errors,
                                                             handleRankChange,
                                                             handleCommentChange,
                                                             allApplications,
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
                    <Table.ColumnHeader>Position</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader>View Application</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {applications.map((application) => (
                    <Table.Row key={application.id}>
                        <Table.Cell>
                            {application.user.firstName} {application.user.lastName}</Table.Cell>
                        <Table.Cell>{application.course.code}</Table.Cell>
                        <Table.Cell>{application.course.name}</Table.Cell>
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

                        <Table.Cell>{application.positionType}</Table.Cell>
                        <Table.Cell>{application.status}</Table.Cell>

                        {/* “Display application details and reviews */}
                        <Table.Cell>
                            <Drawer.Root size="xl">
                                <Drawer.Trigger asChild>
                                    <Button variant="solid" size="sm" bg="#fddf49">

                                        View Details
                                    </Button>
                                </Drawer.Trigger>
                                <Portal>
                                    <Drawer.Backdrop />
                                    <Drawer.Positioner>
                                        <Drawer.Content>
                                            <Drawer.Header>
                                                <Drawer.Title>
                                                    {application.user.firstName}{" "}
                                                    {application.user.lastName} —{" "}
                                                    {application.course.code} {application.course.name}
                                                </Drawer.Title>
                                            </Drawer.Header>

                                            <Drawer.Body pb={6}>
                                                {/**
                                                 * Render all the review/rank/comment UI inside the drawer.
                                                 **/}
                                                <SelectedApplicantCard
                                                    applicant={application}
                                                    error={errors[application.id]}
                                                    allApplications={allApplications}
                                                    handleRankChange={(newRank) =>
                                                        handleRankChange(
                                                            application.id,
                                                            newRank
                                                        )
                                                    }
                                                    handleCommentChange={(newComment) =>
                                                        handleCommentChange(application.id, newComment)
                                                    }
                                                />
                                            </Drawer.Body>

                                            <Drawer.CloseTrigger asChild>
                                                <CloseButton
                                                    size="sm"
                                                    position="absolute"
                                                    top="8px"
                                                    right="8px"
                                                />
                                            </Drawer.CloseTrigger>
                                        </Drawer.Content>
                                    </Drawer.Positioner>
                                </Portal>
                            </Drawer.Root>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
};

export default ApplicantsTable;
