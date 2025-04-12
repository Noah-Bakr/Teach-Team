"use client";

import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, SimpleGrid } from '@chakra-ui/react';
import { Applicant } from '@/types/types';
import { DEFAULT_APPLICANTS } from "@/types/testData";
import SearchAndSortBar from "@/components/SearchAndSortBar";
import SelectedApplicantCard from "@/components/SelectedApplicantCard";
import ApplicantsTable from "@/components/ApplicantsTable";
import VisualRepresentation from '../components/VisualRepresentation';
import { useUserLookup } from "@/utils/userLookup";
import { useCourseLookup } from "@/utils/courseLookup";
import "@/styles/Lecturer.css";
import {CreamCard} from "@/components/CreamCard";

const LecturerPage: React.FC = () => {
    // Use a lazy initialiser: try to load from localStorage; if missing, fall back to DEFAULT_APPLICANTS.
    const [applicants, setApplicants] = useState<Applicant[]>(() => {
        const stored = localStorage.getItem('applicants');
        return stored ? JSON.parse(stored) : DEFAULT_APPLICANTS;
    });

    // State to track validation errors for applicants by id
    const [errors, setErrors] = useState<{
        [id: string]: { rank?: string; comment?: string };
    }>({});

    // State for search & sort
    const [search, setSearch] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('');

    // Save applicants state to localStorage when it changes.
    useEffect(() => {
        localStorage.setItem('applicants', JSON.stringify(applicants));
    }, [applicants]);

    // Toggle Selection for Applicant
    const toggleSelect = (id: string) => {
        setApplicants((prev) =>
            prev.map((app) =>
                app.id === id ? {...app, selected: !app.selected} : app)
        );
    };

    /* Update rank and comments for selected applicants
       Overloaded functions to enforce types for rank and comments

       Validation:
            Rank: Must be a positive number.
            Rank: Each rank value can only be selected once per course
            Comments: Must not exceed 200 characters.
     */
    function updateApplicantDetails(id: string, key: "rank", value: number): void;
    function updateApplicantDetails(id: string, key: "comment", value: string): void;
    function updateApplicantDetails(
        id: string,
        key: "rank" | "comment",
        value: number | string
    ): void {
        setApplicants((prev) =>
            prev.map((app) =>
                (app.id === id ? { ...app, [key]: value } : app))
        );
    }

    // Handle rank changes with validation
    const handleRankChange = (id: string, newValue: string) => {
        const rank = Number(newValue);
        if (rank > 0) {
            // Find applicant  being updated
            const currentApplicant = applicants.find((app) => app.id === id);
            if (currentApplicant) {
                // Check if another applicant in the same course already has the same rank.
                const duplicate = applicants.find((app) =>
                    app.id !== id &&
                    app.selected &&
                    app.courseId === currentApplicant.courseId &&
                    app.rank === rank
                );
                if (duplicate) {
                    setErrors((prev) => ({
                        ...prev,
                        [id]: {
                            ...prev[id],
                            rank: `Rank ${rank} is already assigned for ${currentApplicant.courseId}`
                        }
                    }));
                    return;
                } else {
                    setErrors((prev) => ({
                        ...prev,
                        [id]: {...prev[id], rank: ''},
                    }));
                    updateApplicantDetails(id, "rank", rank);
                }
            }
        } else {
            // Set an error if rank is not greater than 0.
            setErrors((prev) => ({
                ...prev,
                [id]: { ...prev[id], rank: 'Rank must be greater than 0' },
            }));
        }
    };

    // Handle comment changes with validation.
    const handleCommentChange = (id: string, newValue: string) => {
        if (newValue.length <= 200) {
            // Clear any comment error if valid.
            setErrors((prev) => ({
                ...prev,
                [id]: { ...prev[id], comment: '' },
            }));
            updateApplicantDetails(id, "comment", newValue);
        } else {
            // Set error message for too long comment.
            setErrors((prev) => ({
                ...prev,
                [id]: { ...prev[id], comment: 'Comment cannot exceed 200 characters' },
            }));
        }
    };

    // Use the custom hooks for user and course lookups
    const userLookup = useUserLookup();
    const courseLookup = useCourseLookup();

    // Helper function to get users full name
    const getUserName = (userId: string): string => {
        const user = userLookup[userId];
        return user ? `${user.firstName} ${user.lastName}` : userId;
    };

    // Helper function to get course name
    const getCourseName = (courseId: string): string => {
        const course = courseLookup[courseId];
        // If found, return the course name; otherwise fallback to the courseId
        return course ? course.name : courseId;
    };

    // Filter -Combine Applicants field into a searchable string
    const filteredApplicants = applicants.filter((applicant) => {
        const lowercaseSearch = search.toLowerCase();
        return (
            getUserName(applicant.userId).toLowerCase().includes(lowercaseSearch) ||
            applicant.courseId.toLowerCase().includes(lowercaseSearch) ||
            getCourseName(applicant.courseId).toLowerCase().includes(lowercaseSearch) ||
            applicant.availability.join(" ").toLowerCase().includes(lowercaseSearch) ||
            applicant.skills.join(' ').toLowerCase().includes(lowercaseSearch));
    });

    // Sort - If sortBy options selected, sort by filteredApplicants
    const sortedApplicants = sortBy ? [...filteredApplicants].sort((a, b) => {
        if(sortBy === 'course') {
            return a.courseId.localeCompare(b.courseId);
        } else if (sortBy === 'availability') {
            return a.availability.join(" ").localeCompare(b.availability.join(" "));
        }
        return 0;
    }) : filteredApplicants;

    // Group Selected Applicants by course
    const selectedByCourse = applicants
        .filter((app) => app.selected)
        .reduce((acc, app) => {
            const courseKey = app.courseId;
            if (!acc[courseKey]) acc[courseKey] = [];
            acc[courseKey].push(app);
            return acc;
        }, {} as Record<string, Applicant[]>);

    return (

        <Box p={4}>
            <CreamCard>
                <Heading mb={4}>Lecturer Dashboard</Heading>

                {/* Search & Sort */}
                <SearchAndSortBar search={search}
                                  setSearch={setSearch}
                                  sortBy={sortBy}
                                  setSortBy={setSortBy} />

                {/* Applicants List */}
                <Box mb={8}>
                    <Heading size="md" mb={2}>Applicants</Heading>
                    <ApplicantsTable applicants={sortedApplicants} toggleSelect={toggleSelect} />
                </Box>

                {/* Selected Applicants Grouped by Course */}
                <Box mb={8}>
                    <Heading size="sm" mb={2}>Selected Applicants</Heading>

                    {Object.entries(selectedByCourse).length === 0 ? (
                        <Text>No Applicants Selected, Please choose to proceed.</Text>
                    ) : (
                        Object.entries(selectedByCourse).map(([courseId, apps]) => (
                            <Box key={courseId} mb={1}>
                                <Heading as="h3" mb={2}>Course: {getCourseName(courseId)}</Heading>
                                <SimpleGrid minChildWidth="sm" columns={[1, null, 2]} columnGap="4" rowGap="0">
                                {apps.map((applicant) => (
                                    <SelectedApplicantCard
                                        key={applicant.id}
                                        applicant={applicant}
                                        error={errors[applicant.id]}
                                        handleRankChange={handleRankChange}
                                        handleCommentChange={handleCommentChange}
                                    />
                                ))}
                                </SimpleGrid>
                            </Box>
                        ))
                    )}
                </Box>

                {/* Visual Representation */}
                <VisualRepresentation applicants={applicants} />
            </CreamCard>
        </Box>

    );
};

export default LecturerPage;