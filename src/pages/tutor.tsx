import { DEFAULT_COURSES, Course } from "@/testData/courses";
import { Badge, Box, Button, Card, Heading, HStack, Skeleton, Stack } from "@chakra-ui/react"
import { useEffect, useState } from "react";

const TutorPage: React.FC = () => {
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
            <h1>Tutor Page</h1>
            <p>Welcome to the Tutor page!</p>

            <Stack p={4} m={4} gap={4} direction="column" wrap="wrap">
                {courses.map((course) => (
                    <Skeleton asChild loading={false} >
                    <Card.Root colorPalette="yellow" flexDirection="row" overflow="hidden" maxW="xl" key={course.id} variant="outline" size="sm">
                        <Box>
                            <Card.Body>
                                <Card.Title mb="2">{course.name}</Card.Title>
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
                                <Button>Buy Latte</Button>
                            </Card.Footer>
                        </Box>
                    </Card.Root>
                    </Skeleton>
                ))}
            </Stack>
        </div>
    );
};

export default TutorPage;