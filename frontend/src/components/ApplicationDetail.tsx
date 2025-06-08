"use client";

import React, { useState } from "react";
import { Box, Heading, Text, Badge, Flex, HStack, Button, Stack } from "@chakra-ui/react";
import { ApplicationUI, ApplicationStatus } from "@/types/types";
import { updateApplicationStatusByLecturer } from "@/services/lecturerService";
import { toaster } from "@/components/ui/toaster";
import { useAuth } from "@/context/AuthContext";
import "../styles/drawerStyles.css";

interface ApplicationDetailsProps {
    application: ApplicationUI;
    onStatusChange: (appId: number, newStatus: ApplicationStatus) => void;
}

export const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({
                                                                          application,
                                                                          onStatusChange,
                                                                      }) => {
    const { user, course, positionType, status, appliedAt, availability } = application;
    const { currentUser } = useAuth();
    const lecturerId = currentUser?.id;
    const [isUpdating, setIsUpdating] = useState(false);

    // Format "Applied on" date as “Apr 2, 2025”
    const formattedDate = new Date(appliedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    // Handler to set status = 'accepted'
    const onApprove = async () => {
        try {
            setIsUpdating(true);
            await updateApplicationStatusByLecturer(currentUser!.id, application.id, { status: "accepted" });

            // Display notification toaster if approved successfully
            toaster.create({
                title: "Application Approved",
                description: `You have approved application #${application.id}.`,
                type: "success",
                duration: 4000,
                meta: { closable: true },
            });

            // Call the onStatusChange callback to update the parent component
            onStatusChange(application.id, "accepted");
            setIsUpdating(false);

        } catch (err) {
            console.error("Error approving application:", err);

            // Display error toaster if approval fails
            toaster.create({
                title: "Approval Failed",
                description: `Could not approve application #${application.id}.`,
                type: "error",
                duration: 4000,
                meta: { closable: true },
            });

            // Reset updating state
            setIsUpdating(false);
        }
    };

    // Handler to set status = 'rejected'
    const onReject = async () => {
        try {
            setIsUpdating(true);
            if (!lecturerId) return; // or show toaster
            await updateApplicationStatusByLecturer(currentUser!.id, application.id, { status: "rejected" });

            // Display notification toaster if rejected successfully
            toaster.create({
                title: "Application Rejected",
                description: `You have rejected application #${application.id}.`,
                type: "warning",
                duration: 4000,
                meta: { closable: true },
            });

            // Call the onStatusChange callback to update the parent component
            onStatusChange(application.id, "rejected");
            setIsUpdating(false);

        } catch (err) {
            console.error("Error rejecting application:", err);

            // Display error toaster if rejection fails
            toaster.create({
                title: "Rejection Failed",
                description: `Could not reject application #${application.id}.`,
                type: "error",
                duration: 4000,
                meta: { closable: true },
            });
            setIsUpdating(false);
        }
    };

    // Build CSS class for status badge, to change colour based on status
    const statusClass = `app-details__badge app-details__badge--${status}`;

    return (
        <Box
            className="app-details__container"
            bg="white"
            borderRadius="md"
            boxShadow="sm"
            p={4}
            mb={6}
            _dark={{ bg: "black/93" }}
        >
            {/** HEADER: Application #, Badges, Applied On ── **/}
            <Box className="app-details__header" mb={6}>
                <Flex justify="space-between" align="center">
                    <Box>
                        <Heading className="app-details__title" as="h2" mb={2}>
                            Application #{application.id}
                        </Heading>

                        <HStack
                            className="app-details__badges-container"
                            margin={2}
                            wrap="wrap"
                            ml={1}
                        >
                            {/** Position Type Badge **/}
                            <Badge
                                className="app-details__badge app-details__badge--position-type"
                                bg="#ffd73b"
                                color="#121212"
                                textTransform="uppercase"
                                fontSize="0.75rem"
                                px={2}
                                py={1}
                                borderRadius="sm"
                            >
                                {positionType.replace("_", " ")}
                            </Badge>

                            {/** Status Badge **/}
                            <span className={statusClass}>{status}</span>
                        </HStack>

                        <Text
                            className="app-details__applied-date"
                            fontSize="sm"
                            color="gray.400"
                            mt={2}
                            ml={1}
                        >
                            Applied on: {formattedDate}
                        </Text>
                    </Box>

                    {/** Approve / Reject Buttons **/}
                    <HStack margin={2}>
                        <Button className="accept-button"
                                loadingText="Saving..."
                                size="sm"
                                onClick={onApprove}
                        >
                            Approve
                        </Button>
                        <Button className="reject-button"
                                loadingText="Saving..."
                                size="sm"
                                onClick={onReject}
                        >
                            Reject
                        </Button>
                    </HStack>
                </Flex>
            </Box>

            {/** TWO-COLUMN LAYOUT: Candidate (left) & Course Applied For (right) **/}
            <Box className="app-details__two-column" mb={6}>
                <HStack align="start" margin={6} mx={2}>
                    <Box flex="1">
                        <Heading
                            className="app-details__section-title"
                            size="sm"
                            mb={3}
                        >
                            Candidate
                        </Heading>

                        <Stack className="app-details__candidate-info" margin={2} ml={2}>
                            <HStack className="app-details__field-row">
                                <Text
                                    className="app-details__field-label"
                                    fontWeight="bold"
                                    w="90px"
                                >
                                    Name:
                                </Text>
                                <Text className="app-details__field-value">
                                    {user.firstName} {user.lastName}
                                </Text>
                            </HStack>

                            <HStack className="app-details__field-row">
                                <Text
                                    className="app-details__field-label"
                                    fontWeight="bold"
                                    w="90px"
                                >
                                    Email:
                                </Text>
                                <Text className="app-details__field-value">
                                    {user.email}
                                </Text>
                            </HStack>

                            <HStack className="app-details__field-row">
                                <Text
                                    className="app-details__field-label"
                                    fontWeight="bold"
                                    w="90px"
                                >
                                    Availability:
                                </Text>
                                <Text className="app-details__field-value">
                                    {availability}
                                </Text>
                            </HStack>
                        </Stack>

                        {/** User Skills **/}
                        <Heading className="app-details__section-title" size="sm" mt={4} mb={2}>
                            User Skills
                        </Heading>
                        {application.user.skills && application.user.skills.length > 0 ? (
                            <HStack
                                className="app-details__skills-list"
                                wrap="wrap"
                                ml={2}
                                margin={2}
                            >
                                {application.user.skills.map((s) => (
                                    <Badge
                                        key={s.name}
                                        className="app-details__skill-badge"
                                        colorScheme="teal"
                                        fontSize="0.75rem"
                                        px={2}
                                        py={1}
                                        borderRadius="sm"
                                    >
                                        {s.name}
                                    </Badge>
                                ))}
                            </HStack>
                        ) : (
                            <Text
                                className="app-details__none-text"
                                fontSize="sm"
                                color="gray.500"
                                ml={2}
                            >
                                — None —
                            </Text>
                        )}
                    </Box>

                    {/** Right Column: Course Details **/}
                    <Box flex="1">
                        <Heading
                            className="app-details__section-title"
                            size="sm"
                            mb={3}
                        >
                            Course Applied For
                        </Heading>

                        <Stack className="app-details__course-info" margin={2} ml={2}>
                            <HStack className="app-details__field-row">
                                <Text
                                    className="app-details__field-label"
                                    fontWeight="bold"
                                    w="130px"
                                >
                                    Course Code:
                                </Text>
                                <Text className="app-details__field-value"
                                      w="130px">
                                    {course.code}
                                </Text>
                            </HStack>
                            <HStack className="app-details__field-row">
                                <Text
                                    className="app-details__field-label"
                                    fontWeight="bold"
                                    w="130px"
                                >
                                    Course Name:
                                </Text>
                                <Text className="app-details__field-value"
                                      w="250px">
                                    {course.name}
                                </Text>
                            </HStack>

                            <HStack className="app-details__field-row">
                                <Text
                                    className="app-details__field-label"
                                    fontWeight="bold"
                                    w="130px"
                                >
                                    Semester:
                                </Text>
                                <Text className="app-details__field-value"
                                      w="130px">
                                    {course.semester}
                                </Text>
                            </HStack>
                        </Stack>

                        {/** Course Skills **/}
                        <Heading
                            className="app-details__section-title"
                            size="sm"
                            mt={4}
                            mb={2}
                        >
                            Course Skills
                        </Heading>
                        {course.skills && course.skills.length > 0 ? (
                            <HStack
                                className="app-details__course-skills-list"
                                wrap="wrap"
                                ml={2}
                                margin={2}
                            >
                                {course.skills.map((cs) => (
                                    <Badge
                                        key={cs}
                                        className="app-details__course-skill-badge"
                                        colorScheme="purple"
                                        fontSize="0.75rem"
                                        px={2}
                                        py={1}
                                        borderRadius="sm"
                                    >
                                        {cs}
                                    </Badge>
                                ))}
                            </HStack>
                        ) : (
                            <Text
                                className="app-details__none-text"
                                fontSize="sm"
                                color="gray.500"
                                ml={2}
                            >
                                — None —
                            </Text>
                        )}
                    </Box>
                </HStack>
            </Box>

            {/** ACADEMIC CREDENTIALS **/}
            <Box className="app-details__credentials-section" mb={6} mx={2}>
                <Heading className="app-details__section-title" size="sm" mb={3}>
                    Academic Credentials:
                </Heading>

                {user.academicCredentials && user.academicCredentials.length > 0 ? (
                    <HStack
                        className="app-details__credentials-list"
                        wrap="wrap"
                        margin={6}
                        ml={2}
                    >
                        {user.academicCredentials.map((cred, idx) => (
                            <Box key={idx} flex="1" minW="240px">
                                <Text fontWeight="bold">
                                    {cred.degreeName} – {cred.institution}
                                </Text>
                                <Text fontSize="sm" color="white.400">
                                    {cred.startDate} – {cred.endDate}
                                </Text>
                            </Box>
                        ))}
                    </HStack>
                ) : (
                    <Text
                        className="app-details__none-text"
                        fontSize="sm"
                        color="gray.500"
                        ml={2}
                    >
                        — None —
                    </Text>
                )}
            </Box>

            {/** PREVIOUS ROLES **/}
            <Box className="app-details__roles-section" mb={4} mx={2}>
                <Heading className="app-details__section-title" size="sm" mb={3}>
                    Previous Roles:
                </Heading>

                {user.previousRoles && user.previousRoles.length > 0 ? (
                    <HStack
                        className="app-details__roles-list"
                        wrap="wrap"
                        margin={6}
                        ml={2}
                    >
                        {user.previousRoles.map((role, idx) => (
                            <Box key={idx} flex="1" minW="240px">
                                <HStack>
                                    <Text fontWeight="bold">Position:</Text>
                                    <Text>{role.role}</Text>
                                </HStack>
                                <HStack>
                                    <Text fontWeight="bold">Company:</Text>
                                    <Text>{role.company}</Text>
                                </HStack>
                                <HStack>
                                    <Text fontWeight="bold">Start Date:</Text>
                                    <Text>{role.startDate}</Text>
                                </HStack>
                                <HStack>
                                    <Text fontWeight="bold">End Date:</Text>
                                    <Text>{role.endDate}</Text>
                                </HStack>
                                <HStack align="start">
                                    <Text fontWeight="bold">Description:</Text>
                                    <Text>{role.description}</Text>
                                </HStack>
                            </Box>
                        ))}
                    </HStack>
                ) : (
                    <Text
                        className="app-details__none-text"
                        fontSize="sm"
                        color="gray.500"
                        ml={2}
                    >
                        — None —
                    </Text>
                )}
            </Box>
        </Box>
    );
};

export default ApplicationDetails;
