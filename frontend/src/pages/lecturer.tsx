// src/pages/LecturerPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Box, Heading, Text, SimpleGrid } from "@chakra-ui/react";
import { ApplicationUI } from "@/types/applicationTypes";
import { fetchAllApplications } from "@/services/applicationService";
import { createRanking } from "@/services/rankingService";
import { createComment } from "@/services/commentService";
import SearchAndSortBar from "@/components/SearchAndSortBar";
import SelectedApplicantCard from "@/components/SelectedApplicantCard";
import ApplicantsTable from "@/components/ApplicantsTable";
import VisualRepresentation from "@/components/VisualRepresentation";
import { useCourseLookup } from "@/utils/courseLookup";
import "@/styles/Lecturer.css";
import { CreamCard } from "@/components/CreamCard";

export const LecturerPage: React.FC = () => {
    const [applications, setApplications] = useState<ApplicationUI[]>([]);
    const [errors, setErrors] = useState<{
        [appId: number]: { rank?: string; comment?: string };
    }>({});

    const [search, setSearch] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("");

    const courseLookup = useCourseLookup();

    // Replace this with your real “logged‐in” lecturer’s ID.
    const lecturerId = 2;

    useEffect(() => {
        (async () => {
            try {
                const appsUI: ApplicationUI[] = await fetchAllApplications();
                setApplications(appsUI);
            } catch (err) {
                console.error(err);
            }
        })();
    }, []);

    // Toggle selection state
    const toggleSelect = (appId: number) => {
        setApplications((prev) =>
            prev.map((app) =>
                app.id === appId ? { ...app, selected: !app.selected } : app
            )
        );
    };

    /**
     * When the rank input changes, update local state AND send to backend.
     */
    const handleRankChange = async (appId: number, newValue: string) => {
        const rank = Number(newValue);
        if (rank > 0) {
            const currentApp = applications.find((app) => app.id === appId);
            if (currentApp) {
                // Prevent duplicate rank per course
                const duplicate = applications.find(
                    (app) =>
                        app.id !== appId &&
                        app.selected &&
                        app.course.id === currentApp.course.id &&
                        app.rank?.[0]?.ranking === rank
                );
                if (duplicate) {
                    setErrors((prev) => ({
                        ...prev,
                        [appId]: {
                            ...prev[appId],
                            rank: `Rank ${rank} already assigned for course ${currentApp.course.name}`,
                        },
                    }));
                    return;
                } else {
                    setErrors((prev) => ({
                        ...prev,
                        [appId]: { ...prev[appId], rank: "" },
                    }));

                    // Update local state immediately (show in UI)
                    setApplications((prev) =>
                        prev.map((app) =>
                            app.id === appId
                                ? {
                                    ...app,
                                    rank: [
                                        {
                                            id: Date.now(), // temporary frontend ID
                                            ranking: rank,
                                            createdAt: "",
                                            updatedAt: "",
                                            lecturerName: "", // will be filled by backend’s response
                                        },
                                    ],
                                }
                                : app
                        )
                    );

                    // Then send to backend:
                    try {
                        const savedRanking = await createRanking({
                            application_id: appId,
                            lecturer_id: lecturerId,
                            rank: rank,
                        });
                        // Optionally, you can merge `savedRanking` into local state so that
                        // the returned `createdAt` / `updatedAt` / `lecturerName` propagate.
                        setApplications((prev) =>
                            prev.map((app) =>
                                app.id === appId
                                    ? {
                                        ...app,
                                        rank: [
                                            {
                                                id: savedRanking.id,
                                                ranking: savedRanking.ranking,
                                                createdAt: savedRanking.createdAt,
                                                updatedAt: savedRanking.updatedAt,
                                                lecturerName: savedRanking.lecturerName,
                                            },
                                        ],
                                    }
                                    : app
                            )
                        );
                    } catch (err) {
                        console.error("Failed to save ranking:", err);
                        // Optionally set an error message in UI
                        setErrors((prev) => ({
                            ...prev,
                            [appId]: {
                                ...prev[appId],
                                rank: "Error saving ranking to server",
                            },
                        }));
                    }
                }
            }
        } else {
            setErrors((prev) => ({
                ...prev,
                [appId]: { ...prev[appId], rank: "Rank must be greater than 0" },
            }));
        }
    };

    /**
     * When the comment textarea changes, update local state AND send to backend.
     */
    const handleCommentChange = async (appId: number, newValue: string) => {
        if (newValue.length <= 200) {
            setErrors((prev) => ({
                ...prev,
                [appId]: { ...prev[appId], comment: "" },
            }));

            // Update local state for immediate display
            setApplications((prev) =>
                prev.map((app) =>
                    app.id === appId
                        ? {
                            ...app,
                            comments: [
                                {
                                    id: Date.now(), // temporary frontend ID
                                    text: newValue,
                                    createdAt: "",
                                    updatedAt: "",
                                    lecturerName: "",
                                },
                            ],
                        }
                        : app
                )
            );

            // Then send to backend
            try {
                const savedComment = await createComment({
                    application_id: appId,
                    lecturer_id: lecturerId,
                    comment: newValue.trim(),
                });
                // Merge returned comment into local state so timestamps / lecturerName propagate
                setApplications((prev) =>
                    prev.map((app) =>
                        app.id === appId
                            ? {
                                ...app,
                                comments: [
                                    {
                                        id: savedComment.id,
                                        text: savedComment.text,
                                        createdAt: savedComment.createdAt,
                                        updatedAt: savedComment.updatedAt,
                                        lecturerName: savedComment.lecturerName,
                                    },
                                ],
                            }
                            : app
                    )
                );
            } catch (err) {
                console.error("Failed to save comment:", err);
                setErrors((prev) => ({
                    ...prev,
                    [appId]: {
                        ...prev[appId],
                        comment: "Error saving comment to server",
                    },
                }));
            }
        } else {
            setErrors((prev) => ({
                ...prev,
                [appId]: { ...prev[appId], comment: "Comment exceeds 200 chars" },
            }));
        }
    };

    // ——— Filtering logic ———
    const filteredApps = applications.filter((app) => {
        const lower = search.toLowerCase();

        const fullName = `${app.user.firstName} ${app.user.lastName}`.toLowerCase();
        const matchesName = fullName.includes(lower);

        const matchesCourse =
            app.course.name.toLowerCase().includes(lower) ||
            app.course.code.toLowerCase().includes(lower);

        const matchesAvailability = app.availability
            .toLowerCase()
            .includes(lower);

        const matchesSkills = app.user.skills
            .map((s) => s.toLowerCase())
            .join(" ")
            .includes(lower);

        return matchesName || matchesCourse || matchesAvailability || matchesSkills;
    });

    const sortedApps = sortBy
        ? [...filteredApps].sort((a, b) => {
            if (sortBy === "course") {
                return a.course.name.localeCompare(b.course.name);
            } else if (sortBy === "availability") {
                return a.availability.localeCompare(b.availability);
            }
            return 0;
        })
        : filteredApps;

    // Group selected by course ID
    const selectedByCourse = applications
        .filter((app) => app.selected)
        .reduce((acc, app) => {
            const key = app.course.id;
            if (!acc[key]) acc[key] = [];
            acc[key].push(app);
            return acc;
        }, {} as Record<number, ApplicationUI[]>);

    return (
        <Box p={4}>
            <CreamCard>
                <Heading mb={4}>Lecturer Dashboard</Heading>

                <SearchAndSortBar
                    search={search}
                    setSearch={setSearch}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />

                {/* Applicants Table */}
                <Box mb={8}>
                    <Heading size="md" mb={2}>
                        Applicants
                    </Heading>
                    <ApplicantsTable
                        applications={sortedApps}
                        toggleSelect={toggleSelect}
                    />
                </Box>

                {/* Selected Applicants, grouped by course */}
                <Box mb={8}>
                    <Heading size="sm" mb={2}>
                        Selected Applicants
                    </Heading>

                    {Object.keys(selectedByCourse).length === 0 ? (
                        <Text>No applicants selected.</Text>
                    ) : (
                        Object.entries(selectedByCourse).map(
                            ([courseIdStr, apps]) => {
                                const courseIdNum = Number(courseIdStr);
                                const courseName =
                                    courseLookup[courseIdNum]?.name ||
                                    String(courseIdNum);

                                return (
                                    <Box key={courseIdNum} mb={4}>
                                        <Heading as="h3" size="sm" mb={2}>
                                            Course: {courseName}
                                        </Heading>
                                        <SimpleGrid
                                            minChildWidth="sm"
                                            columns={[1, null, 2]}
                                            columnGap="4"
                                            rowGap="4"
                                        >
                                            {apps.map((app) => (
                                                <SelectedApplicantCard
                                                    key={app.id}
                                                    applicant={app}
                                                    error={errors[app.id]}
                                                    handleRankChange={(newRank: number) =>
                                                        handleRankChange(app.id, newRank.toString())
                                                    }
                                                    handleCommentChange={(newComment: string) =>
                                                        handleCommentChange(app.id, newComment)
                                                    }

                                                />
                                            ))}
                                        </SimpleGrid>
                                    </Box>
                                );
                            }
                        )
                    )}
                </Box>

                <VisualRepresentation applications={applications} />
            </CreamCard>
        </Box>
    );
};

export default LecturerPage;
