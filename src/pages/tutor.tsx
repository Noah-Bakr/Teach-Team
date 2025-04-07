import { DEFAULT_COURSES, Course } from "@/testData/course";
import { Badge, Box, Button, Card, HStack, Stack } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import ApplicantForm from '../components/ApplicantForm';

const TutorPage: React.FC = () => {
    const [isApplicantFormOpen, setIsApplicantFormOpen] = useState(false);
    
    const handleApplicantClick = () => {
        setIsApplicantFormOpen(true);
    };

    const closeApplicantForm = () => {
        setIsApplicantFormOpen(false);
    };

    const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);

    // Load saved courses from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('courses');
        if (saved) {
            setCourses(JSON.parse(saved));
        }
    }, []);

    // Save courses state to localStorage when it changes.
    useEffect(() => {
        localStorage.setItem('courses', JSON.stringify(DEFAULT_COURSES));
    }, [DEFAULT_COURSES]);

    return (
        <div>
            {isApplicantFormOpen && <ApplicantForm closeForm={closeApplicantForm} />}
            <h1>Tutor Page</h1>
            <p>Welcome to the Tutor page!</p>

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
                                <Button onClick={handleApplicantClick}>Apply</Button>
                            </Card.Footer>
                        </Box>
                    </Card.Root>
                ))}
            </Stack>
        </div>
    );
};

export default TutorPage;