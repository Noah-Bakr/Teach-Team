import { Course } from "@/types/types";
import { DEFAULT_COURSES } from "@/types/testData";
import { Badge, Box, Button, Card, HStack, Stack } from "@chakra-ui/react"
import { useState } from "react";
import ApplicantForm from '../components/ApplicantForm';

const TutorPage: React.FC = () => {
    // Lazy initialiser for courses: load from localStorage or fall back to DEFAULT_COURSES
    const [courses, setCourses] = useState<Course[]>(() => {
        const saved = localStorage.getItem("courses");
        return saved ? JSON.parse(saved) : DEFAULT_COURSES;
    });

    const [isApplicantFormOpen, setIsApplicantFormOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    
    const handleApplicantClick = (course: Course) => {
        setIsApplicantFormOpen(true);
        setSelectedCourse(course);
    };

    const closeApplicantForm = () => {
        setIsApplicantFormOpen(false);
        setSelectedCourse(null);
    };

    return (
        <div>
            {isApplicantFormOpen && selectedCourse && <ApplicantForm closeForm={closeApplicantForm} course={selectedCourse}/>}
            <Stack p={4} m={4} gap={4} direction={['column', 'row']} wrap="wrap" width={"90vw"}>
                {courses.map((course) => (
                    <Card.Root colorPalette="yellow" flexDirection="row" overflow="hidden" width={"500vw"} maxW="xl" key={course.id} variant="outline" size="sm">
                        <Box>
                            <Card.Body>
                                <Card.Title mb="2">{course.name} | {course.id}</Card.Title>
                                <Card.Description>
                                    course description here
                                </Card.Description>
                                <HStack mt="4">
                                    {course.skills?.map((skill, index) => (
                                        <Badge key={index} m={1}>
                                        {skill}
                                    </Badge>))}
                                </HStack>
                            </Card.Body>
                            <Card.Footer>
                                <Button onClick={() => handleApplicantClick(course)}>Apply</Button>
                            </Card.Footer>
                        </Box>
                    </Card.Root>
                ))}
            </Stack>
        </div>
    );
};

export default TutorPage;