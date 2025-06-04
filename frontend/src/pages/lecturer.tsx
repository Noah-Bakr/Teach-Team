"use client";

import React, { useState, useEffect } from "react";
import { Box, Heading, Text, SimpleGrid } from "@chakra-ui/react";
import { ApplicationUI, ReviewUI } from "@/types/applicationTypes";
import { fetchAllApplications } from "@/services/applicationService";
import SearchAndSortBar from "@/components/SearchAndSortBar";
import SelectedApplicantCard from "@/components/SelectedApplicantCard";
import ApplicantsTable from "@/components/ApplicantsTable";
import VisualRepresentation from "@/components/VisualRepresentation";
import { useCourseLookup } from "@/utils/courseLookup";
import "@/styles/Lecturer.css";
import { CreamCard } from "@/components/CreamCard";
import { useAuth } from "@/context/AuthContext";


export const LecturerPage: React.FC = () => {
    const [applications, setApplications] = useState<ApplicationUI[]>([]);
    const [errors, setErrors] = useState<{
        [appId: number]: { rank?: string; comment?: string };
    }>({});

    const [search, setSearch] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("");

    const courseLookup = useCourseLookup();

    // TODO Replace this with your real “logged‐in” lecturer’s ID.
    const { currentUser } = useAuth();
    const lecturerId = currentUser?.id ?? null;

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

    const onRankSaved = (appId: number, newRank: number) => {
            setApplications(prev =>
                prev.map(app => {
                    if (app.id !== appId) return app;

                    // Overwrite or insert exactly one ReviewUI in the reviews array
                    // If this app already has a reviews array, keep any existing comment from “my” review
                    const oldComment = app.reviews?.find(r => r.lecturerId === lecturerId)
                        ?.comment;

                    const newReview: ReviewUI = {
                        id: Date.now(),       // or you could skip using a temp ID, if you only ever render after the real one arrives
                        rank: newRank,
                        comment: oldComment ?? null,
                        reviewedAt: "",       // backend will set actual timestamp if we re-fetch later
                        updatedAt: "",
                        lecturerId: lecturerId!,
                        // Note: `ReviewUI` does not have an `applicationId` field in this file. If your type
                        //    does have an applicationId, add it here. Otherwise omit it altogether.
                    };

                    return {
                        ...app,
                        reviews: [newReview],
                    };
                })
            );
        };

    //
    // ── NEW: Page‐level callback for when a child successfully saves a new comment
    //    We expect `newComment` to be whatever the backend returned.
    //
    const onCommentSaved = (appId: number, newComment: string) => {
        setApplications(prev =>
            prev.map(app => {
                if (app.id !== appId) return app;

                // Overwrite or insert exactly one ReviewUI
                // If this app already has a reviews array, keep any existing rank from “my” review
                const oldRank = app.reviews?.find(r => r.lecturerId === lecturerId)
                    ?.rank;

                const newReview: ReviewUI = {
                    id: Date.now(),
                    rank: oldRank ?? null,
                    comment: newComment,
                    reviewedAt: "",
                    updatedAt: "",
                    lecturerId: lecturerId!,
                };

                return {
                    ...app,
                    reviews: [newReview],
                };
            })
        );
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
                                                    handleRankChange={newRank =>
                                                        onRankSaved(app.id, newRank)
                                                    }
                                                    handleCommentChange={newComment =>
                                                        onCommentSaved(app.id, newComment)
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
