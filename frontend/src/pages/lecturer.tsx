"use client";

import React, { useState, useEffect } from "react";
import { Box, Heading } from "@chakra-ui/react";
import { ApplicationUI, ReviewUI } from "@/types/applicationTypes";
import { fetchAllApplications } from "@/services/applicationService";
import SearchAndSortBar from "@/components/SearchAndSortBar";
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
    const { currentUser } = useAuth();
    const lecturerId = currentUser?.id ?? null;

    useEffect(() => {
        (async () => {
            try {
                // Fetch all Applications
                const appsUI: ApplicationUI[] = await fetchAllApplications();
                // Filter courses by lecturer
                const myCourseIds = (currentUser?.courses ?? []).map((c) => c.id);
                const myApps = appsUI.filter((app) => myCourseIds.includes(app.course.id));

                setApplications(myApps);
            } catch (err) {
                console.error("Error loading applications:", err);
            }
        })();
    }, [currentUser]);

    const onRankSaved = (appId: number, newRank: number) => {
            setApplications(prev =>
                prev.map(app => {
                    if (app.id !== appId) return app;

                    // Overwrite or insert ReviewUI
                    // If this app already has a reviews array, keep any existing comment from “my” review
                    const oldComment = app.reviews?.find(r => r.lecturerId === lecturerId)
                        ?.comment;

                    const newReview: ReviewUI = {
                        id: Date.now(),
                        rank: newRank,
                        comment: oldComment ?? null,
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

    // Page‐level callback for when a child successfully saves a new comment
    const onCommentSaved = (appId: number, newComment: string) => {
        setApplications(prev =>
            prev.map(app => {
                if (app.id !== appId) return app;

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

    // Filtering logic
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
                        errors={errors}
                        handleRankChange={onRankSaved}
                        handleCommentChange={onCommentSaved}
                        allApplications={applications}
                    />
                </Box>
            </CreamCard>
        </Box>
    );
};

export default LecturerPage;