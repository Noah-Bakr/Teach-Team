import React from "react";
import { Flex, Input, NativeSelect, Text, Box } from "@chakra-ui/react";
import NativeSortSelect from "./NativeSortSelect";
import { CourseUI } from "@/types/types";

interface SearchAndSortBarProps {
    search: string;
    setSearch: (value: string) => void;
    sortBy: string;
    setSortBy: (value: string) => void;
    selectedCourseId: number | null;
    setSelectedCourseId: (value: number | null) => void;
    courses: CourseUI[];
}

// SearchAndSortBar component for filtering and sorting applications
const SearchAndSortBar: React.FC<SearchAndSortBarProps> = ({
                                                               search,
                                                               setSearch,
                                                               sortBy,
                                                               setSortBy,
                                                               selectedCourseId,
                                                               setSelectedCourseId,
                                                               courses,
                                                           }) => (
    <Flex direction="row" gap={4} wrap="wrap" mb={6} align="flex-end">

        {/* Course Dropdown */}
        <Box>
            <Text fontSize="sm" fontWeight="medium" mb={1} color="gray.300">
                Select Course
            </Text>
            <NativeSelect.Root>
                <NativeSelect.Field
                    value={selectedCourseId ?? ""}
                    onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                    style={{
                        width: "240px",
                        height: "48px",
                        backgroundColor: "#1A202C",
                        borderColor: "#4A5568",
                        borderRadius: "0.5rem",
                        paddingLeft: "0.75rem",
                        color: "white",
                    }}
                >
                    <option value="">All Courses</option>
                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.code} — {course.name}
                        </option>
                    ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
            </NativeSelect.Root>
        </Box>

        {/* Search Box */}
        <Box flex={1} minW="320px" maxW="600px">
            <Text fontSize="sm" fontWeight="medium" mb={1} color="gray.300">
                Search
            </Text>
            <Input
                placeholder="Search by name, course, availability or skill"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                height="48px"
                bg="gray.800"
                borderColor="gray.600"
                borderRadius="md"
                color="white"
            />
        </Box>

        {/* Sort Dropdown */}
        <Box>
            <Text fontSize="sm" fontWeight="medium" mb={1} color="gray.300">
                Sort by
            </Text>
            <Box
                width="240px"
                height="48px"
                bg="gray.800"
                border="1px solid"
                borderColor="gray.600"
                borderRadius="md"
                px={2}
            >
                <NativeSortSelect value={sortBy} onChange={setSortBy} />
            </Box>
        </Box>
    </Flex>
);

export default SearchAndSortBar;
