import React, { useState, useEffect } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { Applicant } from '@/testData/types';
import { dummyApplicants } from "@/testData/dummyApplicants";
import SearchAndSortBar from "@/components/SearchAndSortBar";
import SelectedApplicantCard from "@/components/SelectedApplicantCard";
import ApplicantsTable from "@/components/ApplicantsTable";


const LecturerPage: React.FC = () => {
    // Use dummy applicants for initial state
    const [applicants, setApplicants] = useState<Applicant[]>(dummyApplicants);

    // State to track validation errors for applicants by id
    const [errors, setErrors] = useState<{
        [id: number]: { rank?: string; comment?: string };
    }>({});

    // State for search & sort
    const [search, setSearch] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('');

    // Load saved applicants from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('applicants');
        if (saved) {
            setApplicants(JSON.parse(saved));
        }
    }, []);

    // Save applicants state to localStorage when it changes.
    useEffect(() => {
        localStorage.setItem('applicants', JSON.stringify(applicants));
    }, [applicants]);

    // Toggle Selection for Applicant
    const toggleSelect = (id: number) => {
        setApplicants((prev) =>
            prev.map((app) =>
                app.id === id ? {...app, selected: !app.selected} : app
            )
        );
    };

    /* Update rank and comments for selected applicants
       Overloaded functions to enforce types for rank and comments

       Validation:
            Rank: Must be a positive number.
            Comments: Must not exceed 200 characters.
     */
    function updateApplicantDetails(id: number, key: "rank", value: number): void;
    function updateApplicantDetails(id: number, key: "comment", value: string): void;
    function updateApplicantDetails(
        id: number,
        key: "rank" | "comment",
        value: number | string
    ): void {
        setApplicants((prev) =>
            prev.map((app) =>
                app.id === id ? { ...app, [key]: value } : app
            )
        );
    }

    // Handle rank changes with validation
    const handleRankChange = (id: number, newValue: string) => {
        const rank = Number(newValue);
        if (rank > 0) {
            // Clear any rank error if valid.
            setErrors((prev) => ({
                ...prev,
                [id]: { ...prev[id], rank: '' }
            }));
            updateApplicantDetails(id, "rank", rank);
        } else {
            // Set error message for invalid rank.
            setErrors((prev) => ({
                ...prev,
                [id]: { ...prev[id], rank: 'Rank must be greater than 0' }
            }));
        }
    };

    // Handle comment changes with validation.
    const handleCommentChange = (id: number, newValue: string) => {
        if (newValue.length <= 200) {
            // Clear any comment error if valid.
            setErrors((prev) => ({
                ...prev,
                [id]: { ...prev[id], comment: '' }
            }));
            updateApplicantDetails(id, "comment", newValue);
        } else {
            // Set error message for too long comment.
            setErrors((prev) => ({
                ...prev,
                [id]: { ...prev[id], comment: 'Comment cannot exceed 200 characters' }
            }));
        }
    };

    // Filter -Combine Applicants field into a searchable string
    const filteredApplicants = applicants.filter((applicant) => {
        const lowercaseSearch = search.toLowerCase();
        return (
            applicant.name.toLowerCase().includes(lowercaseSearch) ||
                applicant.course.toLowerCase().includes(lowercaseSearch) ||
                applicant.availability.toLowerCase().includes(lowercaseSearch) ||
                applicant.skills.join(' ').toLowerCase().includes(lowercaseSearch));
    });

    // Sort - If sortBy options selected, sort by filteredApplicants
    const sortedApplicants = sortBy ? [...filteredApplicants].sort((a, b) => {
        if(sortBy === 'course') {
            return a.course.localeCompare(b.course);
        } else if (sortBy === 'availability') {
            return a.availability.localeCompare(b.availability);
        }
        return 0;
    }) : filteredApplicants;

    return(
        <Box p={4}>
            <Heading mb={4}>Lecturer Dashboard</Heading>

            {/* Search & Sort */}
            <SearchAndSortBar search={search} setSearch={setSearch} sortBy={sortBy} setSortBy={setSortBy} />

            {/* Applicants List */}
            <Box mb={8}>
                <Heading size="md" mb={2}>Applicants</Heading>
                <ApplicantsTable applicants={sortedApplicants} toggleSelect={toggleSelect} />
            </Box>

            {/* Applicants Ranking and Comments */}
            <Box>
                <Heading size="md" mb={2}>Selected Applicants</Heading>
                {applicants.filter((app) => app.selected).length === 0 ? (
                    <Text>No Applicants Selected, Please choose to proceed.</Text>
                ) : (
                    applicants
                        .filter((app) => app.selected)
                        .map((applicant) => (
                            <SelectedApplicantCard
                                key={applicant.id}
                                applicant={applicant}
                                error={errors[applicant.id]}
                                handleRankChange={handleRankChange}
                                handleCommentChange={handleCommentChange}
                            />
                        ))
                )}
            </Box>
        </Box>
    );
};

export default LecturerPage;