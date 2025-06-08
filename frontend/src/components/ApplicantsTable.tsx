"use client";
import React from "react";
import { Button, Box, Table, Drawer, Portal, CloseButton, } from "@chakra-ui/react";
import { ApplicationUI, ReviewUI, ApplicationStatus } from "@/types/types";
import SelectedApplicantCard from "./SelectedApplicantCard";
import {ApplicationDetail} from "./ApplicationDetail";
import { useAuth } from "@/context/AuthContext";

interface ApplicantsTableProps {
    applications: ApplicationUI[];
    errors: { [appId: number]: { rank?: string; comment?: string } };
    handleRankChange: (appId: number, newValue: number) => void;
    handleCommentChange: (appId: number, newValue: string) => void;
    allApplications: ApplicationUI[];
    onStatusChange: (appId: number, newStatus: ApplicationStatus) => void;
}

// The ApplicantsTable component displays a table of applications with details and actions
const ApplicantsTable: React.FC<ApplicantsTableProps> = ({
                                                             applications,
                                                             errors,
                                                             handleRankChange,
                                                             handleCommentChange,
                                                             allApplications,
                                                             onStatusChange,
                                                         }) => {
    const { currentUser } = useAuth();
    const lecturerId = currentUser?.id ?? null;
    return (
        <Table.Root colorScheme="gray" borderRadius="md" boxShadow="md">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Course Code</Table.ColumnHeader>
                    <Table.ColumnHeader>Course Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Availability</Table.ColumnHeader>
                    <Table.ColumnHeader>Skills</Table.ColumnHeader>
                    <Table.ColumnHeader>Current Rank</Table.ColumnHeader>
                    <Table.ColumnHeader>Position</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader>View Application</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {applications.map((application) => {
                    // Find the “rank” entry that matches this lecturer’s ID:
                    const myReviewObj: ReviewUI | undefined = application.reviews?.find(
                        (review) => review.lecturerId === lecturerId
                    );
                    const myRank = myReviewObj ? myReviewObj.rank : null;

                    return (
                    <Table.Row key={application.id}>
                        <Table.Cell>
                            {application.user.firstName} {application.user.lastName}</Table.Cell>
                        <Table.Cell>{application.course.code}</Table.Cell>
                        <Table.Cell>{application.course.name}</Table.Cell>
                        <Table.Cell>{application.availability}</Table.Cell>

                        <Table.Cell>
                            {application.user.skills?.length
                                ? application.user.skills.map((s) => s.name).join(", ")
                                : "-"}
                        </Table.Cell>

                        {/* Join the lecturer rank for application */}
                        <Table.Cell>
                            {myRank != null ? myRank : "—"}
                        </Table.Cell>

                        <Table.Cell>{application.positionType}</Table.Cell>
                        <Table.Cell>{application.status}</Table.Cell>

                        {/* Side drawer with application full details and review section */}
                        <Table.Cell>
                            <Drawer.Root size="xl">
                                <Drawer.Trigger asChild>
                                    <Button variant="solid" size="sm" bg="#fddf49">

                                        View Details
                                    </Button>
                                </Drawer.Trigger>
                                <Portal>
                                    <Drawer.Backdrop bg="blackAlpha.500" />
                                    <Drawer.Positioner>
                                        <Drawer.Content maxW="800px"
                                                        bg="yellow.500"
                                                        color="white"
                                                        p={0}>
                                            <Drawer.Header bg="yellow.500"
                                                           color="black"
                                                           borderBottom="2px solid"
                                                           borderBottomColor="yellow.600"
                                                           >
                                                <Drawer.Title fontSize="2xl" fontWeight="bold">
                                                    {application.user.firstName}{" "}
                                                    {application.user.lastName} — {" "}
                                                    {application.course.code} {application.course.name}
                                                </Drawer.Title>
                                            </Drawer.Header>

                                            <Drawer.Body p={0}>
                                                <Box px={4} py={3}>
                                                {/* Render all the read‐only application data */}
                                                <ApplicationDetail
                                                    application={application}
                                                    onStatusChange={onStatusChange}/>

                                                    {/** Render all the review/rank/comment UI**/}
                                                    <Box
                                                        bg="white"
                                                        color="black"
                                                        borderRadius="md"
                                                        boxShadow="md"
                                                        p={6}
                                                        _dark={{ bg: "black/93", color: "white" }}
                                                    >
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
                                                    </Box>
                                                </Box>
                                            </Drawer.Body>

                                            <Drawer.CloseTrigger asChild>
                                                <CloseButton
                                                    size="sm"
                                                    position="absolute"
                                                    top="8px"
                                                    right="8px"
                                                    color="white"
                                                />
                                            </Drawer.CloseTrigger>
                                        </Drawer.Content>
                                    </Drawer.Positioner>
                                </Portal>
                            </Drawer.Root>
                        </Table.Cell>
                    </Table.Row>
                    );
                })}
            </Table.Body>
        </Table.Root>
    );
};

export default ApplicantsTable;
