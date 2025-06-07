import { Badge, Box, Button, Card, HStack, Stack } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import ApplicantForm from '../components/ApplicantForm';
import { useAuth } from "@/context/AuthContext";
import { fetchAllCourses } from "@/services/courseService";
import { CourseUI } from "@/types/courseTypes";
import { ApplicationUI } from "@/types/applicationTypes";
import { fetchApplicationsByUserId } from "@/services/applicationService";

const TutorPage: React.FC = () => {
    const [courses, setCourses] = useState<CourseUI[]>([]);
    const [applications, setApplications] = useState<ApplicationUI[]>([]);
    const { currentUser } = useAuth();
    const [isApplicantFormOpen, setIsApplicantFormOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<CourseUI | null>(null);
    
    // Fetch all courses from the database on mount
    useEffect(() => {
        fetchAllCourses()
            .then((coursesUI) => setCourses(coursesUI))
            .catch(console.error);
    }, []);

    // Fetch all applications for the current user
    useEffect(() => {
        if (!currentUser?.id) return;
        fetchApplicationsByUserId(currentUser.id)
            .then(setApplications)
            .catch(console.error);
    }, [currentUser?.id]);

    const handleApplicantClick = (course: CourseUI) => {
        setIsApplicantFormOpen(true);
        setSelectedCourse(course);
    };

    const closeApplicantForm = () => {
        setIsApplicantFormOpen(false);
        setSelectedCourse(null);
    };

    // Check if the user has already applied for the course
    // const hasApplied = (courseId: string): boolean => {
    //     const existingApplications = JSON.parse(localStorage.getItem("applicants") || "[]");
    //     return existingApplications.some(
    //         (application: any) => application.userId === currentUser?.id && application.courseId === courseId
    //     );
    // };
    const hasApplied = (courseId: number): boolean => {
        const appliedCourseIds = new Set(applications.map(app => app.course.id));
        return appliedCourseIds.has(courseId);
    };

    return (
        <div>
            {isApplicantFormOpen && selectedCourse && <ApplicantForm closeForm={closeApplicantForm} course={selectedCourse}/>}
            <Stack p={4} m={4} gap={4} direction={['column', 'row']} wrap="wrap" width={"90vw"}>
                {courses.map((course) => (
                    <Card.Root colorPalette="yellow" flexDirection="row" overflow="hidden" width={"500vw"} maxW="xl" key={course.id} variant="outline" size="sm">
                        <Box>
                            <Card.Body>
                                <Card.Title mb="2">{course.name} | {course.code}</Card.Title>
                                <Card.Description mb="2">{course.semester} Semester</Card.Description>
                                <Card.Description mb="2">Lecturer: {Array.isArray(course.lecturers) ? course.lecturers.join(", ") : course.lecturers}</Card.Description>
                                <HStack>
                                    {course.skills?.map((skill, index) => (
                                        <Badge key={index} m={1}>
                                        {skill}
                                    </Badge>))}
                                </HStack>
                            </Card.Body>
                            <Card.Footer>
                                <Button disabled={hasApplied(course.id)} onClick={() => handleApplicantClick(course)}>{hasApplied(course.id) ? "Applied" : "Apply"}</Button>
                            </Card.Footer>
                        </Box>
                    </Card.Root>
                ))}
            </Stack>
        </div>
    );
};

export default TutorPage;