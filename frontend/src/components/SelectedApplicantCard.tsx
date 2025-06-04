// src/components/SelectedApplicantCard.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Flex,
    Heading,
    Text,
    Input,
    Textarea,
    Button,
} from "@chakra-ui/react";
import { ApplicationUI, ReviewUI } from "@/types/applicationTypes";
import CustomFormControl from "./CustomFormControl";
import { createReview, updateReview } from "@/services/reviewService";
import { toaster } from "@/components/ui/toaster";
import { useAuth } from "@/context/AuthContext";

interface SelectedApplicantCardProps {
    applicant: ApplicationUI;
    error?: { rank?: string; comment?: string };
    handleRankChange: (newRank: number) => void;
    handleCommentChange: (newComment: string) => void;
    allApplications: ApplicationUI[];
}

const SelectedApplicantCard: React.FC<SelectedApplicantCardProps> = ({
                                                                         applicant,
                                                                         error,
                                                                         handleRankChange,
                                                                         handleCommentChange,
                                                                         allApplications
                                                                     }) => {
    // Pull current lecturer ID from Auth:
    const { currentUser } = useAuth();
    const lecturerId = currentUser?.id ?? null;

    // Find “my” existing review (if any):
    const myExistingReviewObj: ReviewUI  | undefined = applicant.reviews?.find(
        (r) => r.lecturerId === lecturerId
    );
    const existingRankValue = myExistingReviewObj
        ? String(myExistingReviewObj.rank ?? "")
        : "";
    const existingCommentValue = myExistingReviewObj
        ? myExistingReviewObj.comment ?? ""
        : "";

    // Local state for the two inputs, seeded from existing values:
    const [localRank, setLocalRank] = useState<string>(existingRankValue);
    const [localComment, setLocalComment] = useState<string>(
        existingCommentValue
    );

    // Re-hydrate if “prop” changes:
    useEffect(() => {
        setLocalRank(existingRankValue);
    }, [existingRankValue]);

    useEffect(() => {
        setLocalComment(existingCommentValue);
    }, [existingCommentValue]);

    // Save logic using Review
    const handleSave = async () => {
        // If not signed in, show error toast:
        if (!lecturerId) {
            toaster.create({
                title: "Not signed in",
                description: "You must be signed in to save a review.",
                type: "error",
                duration: 4000,
                meta: { closable: true },
            });
            return;
        }

        // Validate rank if not empty
        let parsedRank: number | null = null;
        if (localRank.trim() !== "") {
            const num = Number(localRank);
            if (isNaN(num)) {
                toaster.create({
                    title: "Invalid rank",
                    description: "Rank must be a valid number.",
                    type: "warning",
                    duration: 3000,
                    meta: { closable: true },
                });
                return;
            }
            parsedRank = num;
        }
        // Check for same rank in same course for this lecturer
        const duplicateInSameCourse = allApplications.some((otherApp) => {
            return (
                otherApp.id !== applicant.id && // skip self
                otherApp.course.id === applicant.course.id && // same course
                otherApp.reviews?.some(
                    (r) => r.lecturerId === lecturerId && r.rank === parsedRank
                )
            );
        });
        if (duplicateInSameCourse) {
            toaster.create({
                title: "Duplicate rank",
                description: `You’ve already assigned rank ${parsedRank} for another applicant in this course. Please choose a different rank.`,
                type: "warning",
                duration: 4000,
                meta: { closable: true },
            });
            return;
        }

        // Validate comment length
        if (localComment.trim().length > 200) {
            toaster.create({
                title: "Comment too long",
                description: "Maximum 200 characters allowed.",
                type: "warning",
                duration: 3000,
                meta: { closable: true },
            });
            return;
        }


        try {
            if (myExistingReviewObj) {
                // Update existing review
                const updated = await updateReview(myExistingReviewObj.id, {
                    rank: parsedRank,
                    comment: localComment.trim() || null,
                });
                handleRankChange(updated.rank ?? 0);
                handleCommentChange(updated.comment ?? "");
                toaster.create({
                    title: "Review updated",
                    description: "Your review has been updated.",
                    type: "success",
                    duration: 3000,
                    meta: { closable: true },
                });
            } else {
                // Create new review
                const created = await createReview({
                    lecturer_id: lecturerId,
                    application_id: applicant.id,
                    rank: parsedRank ?? undefined,
                    comment: localComment.trim() || undefined,
                });
                handleRankChange(created.rank ?? 0);
                handleCommentChange(created.comment ?? "");
                toaster.create({
                    title: "Review saved",
                    description: "Your review has been recorded.",
                    type: "success",
                    duration: 3000,
                    meta: { closable: true },
                });
            }
        } catch (err: any) {
            console.error("Failed to save review:", err);
            toaster.create({
                title: "Failed to save review",
                description:
                    err?.response?.data?.message ||
                    "There was an error saving your review. Please try again.",
                type: "error",
                duration: 4000,
                meta: { closable: true },
            });
        }
    };

    // Render the card; the “Rank” input is seeded with localRank (which came from existingRankValue).
    //    If no ranking existed, localRank === "" and the input stays blank.
    return (
        <Box
            mt={2}
            p={4}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            boxShadow="md"
            mb={2}
            opacity={lecturerId ? 1 : 0.6} // greyed out if not signed in
        >
            {/* Header */}
            <Heading as="h3" size="md" mb={4}>
                {applicant.user.firstName} {applicant.user.lastName} —{" "}
                {applicant.course.code} {applicant.course.name}
            </Heading>

            {/* Rank input */}
            <Flex align="center" mb={2}>
                <Text mr={2}>Rank:</Text>
                <CustomFormControl error={error?.rank}>
                    <Input
                        type="number"
                        value={localRank}
                        onChange={(e) => setLocalRank(e.target.value)}
                        maxW="80px"
                        //isDisabled={!lecturerId}
                    />
                </CustomFormControl>
            </Flex>

            {/* Comment textarea */}
            <CustomFormControl error={error?.comment}>
                <Textarea
                    placeholder="Enter applicant comments…"
                    value={localComment}
                    onChange={(e) => setLocalComment(e.target.value)}
                    size="sm"
                    //isDisabled={!lecturerId}
                />
            </CustomFormControl>

            {/* Save button */}
            <Button
                mt={3}
                colorScheme="blue"
                size="sm"
                onClick={handleSave}
                //isDisabled={!lecturerId}
            >
                Save to Database
            </Button>

            {!lecturerId && (
                <Text color="red.500" fontSize="sm" mt={2}>
                    Please sign in to save rankings/comments.
                </Text>
            )}
        </Box>
    );
};

export default SelectedApplicantCard;
