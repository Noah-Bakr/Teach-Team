"use client";

import React, { useState, useEffect } from "react";
import { Box, Heading, Flex, Button } from "@chakra-ui/react";
import { ApplicationStatus, ApplicationUI, ReviewUI, CourseUI } from "@/types/types";
import { fetchApplicationsByLecturer, fetchApplicationsByCourse, fetchCoursesByLecturer } from "@/services/lecturerService";
import SearchAndSortBar from "@/components/SearchAndSortBar";
import ApplicantsTable from "@/components/ApplicantsTable";
import { CreamCard } from "@/components/CreamCard";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

export const LecturerPage: React.FC = () => {
    const router = useRouter();
    const [applications, setApplications] = useState<ApplicationUI[]>([]);
    const [errors] = useState<{
        [appId: number]: { rank?: string; comment?: string };
    }>({});
    const [search, setSearch] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("");
    const [courses, setCourses] = useState<CourseUI[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const { currentUser } = useAuth();
    const lecturerId = currentUser?.id ?? null;

    // Fetch applications for the lecturer, optionally filtered by selected course
    useEffect(() => {
        if (!lecturerId) return;

        const fetchData = async () => {
            try {
                let apps: ApplicationUI[] = [];

                if (selectedCourseId) {
                    apps = await fetchApplicationsByCourse(
                        lecturerId,
                        selectedCourseId,
                        search,
                        sortBy
                    );
                } else {
                    apps = await fetchApplicationsByLecturer(
                        lecturerId,
                        search,
                        sortBy
                    );
                }

                setApplications(apps);
                if (apps.length > 0) {
                    console.log("First fetched application:", apps[0]);
                    console.log("Reviews for first application:", apps[0].reviews);
                    console.log("First review in app:", apps[0].reviews?.[0]);
                }
            } catch (err) {
                console.error("Error fetching applications:", err);
            }
        };

        fetchData();
    }, [lecturerId, selectedCourseId, search, sortBy]);


    // Fetch courses for the lecturer
    useEffect(() => {
        if (!lecturerId) return;

        (async () => {
            try {
                const lecturerCourses = await fetchCoursesByLecturer(lecturerId);
                setCourses(lecturerCourses);
            } catch (err) {
                console.error("Error fetching lecturer courses:", err);
            }
        })();
    }, [lecturerId]);

    // Handler to update a single application’s status in state
    const handleStatusChange = (appId: number, newStatus: ApplicationStatus) => {
        setApplications(prev => {
            const newArray = prev.map(app => {
                if (app.id === appId) {
                    return {
                        ...app,
                        status: newStatus
                };
                } else {
                    return app;
                }
            });
            return newArray;
        });
    };

    const onRankSaved = (appId: number, newRank: number) => {
            setApplications(prev =>
                prev.map(app => {
                    if (app.id !== appId) return app;

                    // Overwrite or insert ReviewUI
                    // If this app already has a reviews array, keep any existing comment from “my” review
                    const oldComment = app.reviews?.find(review => review.lecturerId === lecturerId)
                        ?.comment;

                    const newReview: ReviewUI = {
                        id: Date.now(),
                        rank: newRank,
                        comment: oldComment ?? null,
                        reviewedAt: "",
                        updatedAt: "",
                        lecturerId: lecturerId!,
                        applicationId: appId,
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
                const oldRank = app.reviews?.find(review => review.lecturerId === lecturerId)
                    ?.rank;

                const newReview: ReviewUI = {
                    id: Date.now(),
                    rank: oldRank ?? null,
                    comment: newComment,
                    reviewedAt: "",
                    updatedAt: "",
                    lecturerId: lecturerId!,
                    applicationId: appId,
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
            app.course?.name.toLowerCase().includes(lower) ||
            app.course?.code.toLowerCase().includes(lower);

        const matchesAvailability = app.availability
            .toLowerCase()
            .includes(lower);

        const matchesSkills =
            app.user.skills?.map((s) => s.name).join(" ").toLowerCase().includes(lower) ?? false;

        return matchesName || matchesCourse || matchesAvailability || matchesSkills;
    });

    const sortedApps = sortBy
        ? [...filteredApps].sort((a, b) => {
            if (sortBy === "course") {
                const aCourseName = a.course?.name ?? "";
                const bCourseName = b.course?.name ?? "";
                return aCourseName.localeCompare(bCourseName);
            } else if (sortBy === "availability") {
                return a.availability.localeCompare(b.availability);
            }
            return 0;
        })
        : filteredApps;

    return (
        <Box p={4}>
            <CreamCard>
                <Flex justify="space-between" align="center" mb={4}>
                    <Heading>Lecturer Dashboard</Heading>
                    <Button
                        bg = "#fcdd45"
                        onClick={() => router.push("/visual-insights")}
                    >
                        View Lecturers Application Insights
                    </Button>
                </Flex>

                <SearchAndSortBar
                    search={search}
                    setSearch={setSearch}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    selectedCourseId={selectedCourseId}
                    setSelectedCourseId={setSelectedCourseId}
                    courses={courses}
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
                        onStatusChange={handleStatusChange}
                    />
                </Box>
            </CreamCard>
        </Box>
    );
};

export default LecturerPage;