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
import { ApplicationUI } from "@/types/applicationTypes";
import CustomFormControl from "./CustomFormControl";
import { toaster } from "@/components/ui/toaster"

// Service functions for saving
import { createComment } from "@/services/commentService";
import { createRanking } from "@/services/rankingService";

interface SelectedApplicantCardProps {
    applicant: ApplicationUI;
    error?: { rank?: string; comment?: string };

    /**
     * Now each callback only takes a single argument:
     *  - handleRankChange(newRank: number)
     *  - handleCommentChange(newComment: string)
     *
     * The parent (LecturerPage) will already know which applicant it is,
     * because it passed `applicant` down to this card.
     */
    handleRankChange: (newRank: number) => void;
    handleCommentChange: (newComment: string) => void;
}

const SelectedApplicantCard: React.FC<SelectedApplicantCardProps> = ({
                                                                         applicant,
                                                                         error,
                                                                         handleRankChange,
                                                                         handleCommentChange,
                                                                     }) => {
    // --------------------------------------------------------------------------
    // 1) Extract any “existing” rank/comment from the applicant prop
    //    and store them in local state so the user can edit freely.
    // --------------------------------------------------------------------------

    // If backend returned a ranking array, take the first ranking value:
    const existingRank =
        applicant.rank && applicant.rank.length > 0
            ? String(applicant.rank[0].ranking)
            : "";

    // If backend returned a comments array, take the first comment text:
    const existingComment =
        applicant.comments && applicant.comments.length > 0
            ? applicant.comments[0].text
            : "";

    // Local state for the inputs:
    const [localRank, setLocalRank] = useState<string>(existingRank);
    const [localComment, setLocalComment] = useState<string>(existingComment);

    // If the parent ever changes applicant.rank or applicant.comments,
    // we re‐hydrate our local inputs accordingly:
    useEffect(() => {
        setLocalRank(existingRank);
    }, [existingRank]);

    useEffect(() => {
        setLocalComment(existingComment);
    }, [existingComment]);

    // --------------------------------------------------------------------------
    // 2) Fake “logged‐in lecturer ID” (in a real app, grab this from your auth context)
    // --------------------------------------------------------------------------
    const lecturerId = 2;

    // --------------------------------------------------------------------------
    // 3) “Save to Database” logic:
    //    - First send the ranking (if changed)
    //    - Then send the comment (if changed)
    //    After each POST succeeds, call the parent’s single‐arg callback.
    // --------------------------------------------------------------------------
    const handleSave = () => {
        // Build a promise that does both createRanking() and createComment()
        const savePromise = (async () => {
            // If they typed a number for “Rank”, attempt to save it:
            if (localRank.trim() !== "") {
                const rankValue = Number(localRank);
                if (!isNaN(rankValue)) {
                    const savedRanking = await createRanking({
                        application_id: applicant.id,
                        lecturer_id: lecturerId,
                        rank: rankValue,
                    });
                    // Notify parent of new numeric rank:
                    handleRankChange(savedRanking.ranking);
                } else {
                    // If it wasn’t a valid number, throw an error to be caught below
                    throw new Error("Rank must be a valid number");
                }
            }

            // If they typed something for “Comment”, attempt to save it:
            if (localComment.trim() !== "") {
                if (localComment.trim().length > 200) {
                    // We enforce max‐200 chars; throw so toaster shows error
                    throw new Error("Comment exceeds 200 characters");
                }

                const savedComment = await createComment({
                    application_id: applicant.id,
                    lecturer_id: lecturerId,
                    comment: localComment.trim(),
                });
                // Notify parent of new comment:
                handleCommentChange(savedComment.text);
            }

            // If we reach here, both (ranking and comment) succeeded (or neither was needed).
            return true;
        })();

        // Wrap that combined promise in a single toast
        toaster.promise(savePromise, {
            loading: {
                title: "Saving…",
                description: "Hold on while we save your rank & comment.",
            },
            success: {
                title: "Saved!",
                description: `Your ${
                    localRank.trim() !== "" ? "rank" : ""
                }${localRank.trim() !== "" && localComment.trim() !== "" ? " & " : ""}${
                    localComment.trim() !== "" ? "comment" : ""
                } have been recorded successfully.`,
            },
            error: {
                title: "Error",
                description: (err: any) => {
                    // If the thrown error has a message (e.g. “Rank must be valid number”),
                    // show that; otherwise show a generic message.
                    return typeof err === "string" ? err : err.message || "Something went wrong";
                },
            },
        });
    };

    return (
        <Box
            mt={2}
            p={4}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            boxShadow="md"
            mb={2}
        >
            {/* --------------------------------------------------------------
          1) Header: “Name — CourseCode CourseName”
      -------------------------------------------------------------- */}
            <Heading as="h3" size="md" mb={4}>
                {applicant.user.firstName} {applicant.user.lastName} —{" "}
                {applicant.course.code} {applicant.course.name}
            </Heading>

            {/* --------------------------------------------------------------
          2) “Rank” input (type=number)
      -------------------------------------------------------------- */}
            <Flex align="center" mb={2}>
                <Text mr={2}>Rank:</Text>
                <CustomFormControl error={error?.rank}>
                    <Input
                        type="number"
                        value={localRank}
                        onChange={(e) => setLocalRank(e.target.value)}
                        maxW="80px"
                    />
                </CustomFormControl>
            </Flex>

            {/* --------------------------------------------------------------
          3) “Comment” textarea
      -------------------------------------------------------------- */}
            <CustomFormControl error={error?.comment}>
                <Textarea
                    placeholder="Enter applicant comments..."
                    value={localComment}
                    onChange={(e) => setLocalComment(e.target.value)}
                    size="sm"
                />
            </CustomFormControl>

            {/* --------------------------------------------------------------
          4) “Save to Database” button
      -------------------------------------------------------------- */}
            <Button mt={3} colorScheme="blue" size="sm" onClick={handleSave}>
                Save to Database
            </Button>
        </Box>
    );
};

export default SelectedApplicantCard;
