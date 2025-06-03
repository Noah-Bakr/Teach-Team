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
    const handleSave = async () => {
        // 3a) If they typed a number in “Rank”, attempt to save it:
        if (localRank.trim() !== "") {
            const rankValue = Number(localRank);
            if (!isNaN(rankValue)) {
                try {
                    const savedRanking = await createRanking({
                        application_id: applicant.id,
                        lecturer_id: lecturerId,
                        rank: rankValue,
                    });
                    // Call parent with just the new numeric rank:
                    handleRankChange(savedRanking.ranking);
                } catch (err) {
                    console.error("Failed to save ranking:", err);
                }
            } else {
                console.warn("Rank must be a valid number");
            }
        }

        // 3b) If they typed something into “Comment”, attempt to save it:
        if (localComment.trim() !== "") {
            try {
                const savedComment = await createComment({
                    application_id: applicant.id,
                    lecturer_id: lecturerId,
                    comment: localComment.trim(),
                });
                // Call parent with just the new comment string:
                handleCommentChange(savedComment.text);
            } catch (err) {
                console.error("Failed to save comment:", err);
            }
        }
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
