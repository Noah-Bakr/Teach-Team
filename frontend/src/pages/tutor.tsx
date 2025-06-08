import { Badge, Box, Button, Card, HStack, Stack } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import ApplicantForm from '../components/ApplicantForm';
import { useAuth } from "@/context/AuthContext";
import { fetchAllCourses } from "@/services/courseService";
import { CourseUI } from "@/types/courseTypes";
import { ApplicationUI } from "@/types/types";
import { fetchApplicationsByUserId } from "@/services/applicationService";

const TutorPage: React.FC = () => {
    const [courses, setCourses] = useState<CourseUI[]>([]);
    const [applications, setApplications] = useState<ApplicationUI[]>([]);
    const { currentUser } = useAuth();
    const [isApplicantFormOpen, setIsApplicantFormOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<CourseUI | null>(null);
    const [selectedRole, setSelectedRole] = useState<"tutor" | "lab_assistant" | null>(null);

    
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

    const applicationLookup = new Set(
        applications.map(app => `${app.course.id}-${app.positionType}`)
    );

    const handleApplicantClick = (course: CourseUI, role: "tutor" | "lab_assistant") => {
        setSelectedCourse(course);
        setSelectedRole(role);
        setIsApplicantFormOpen(true);
    };

    const closeApplicantForm = () => {
        setIsApplicantFormOpen(false);
        setSelectedCourse(null);
    };

    const refreshApplications = async () => {
        if (!currentUser?.id) return;
        try {
            const apps = await fetchApplicationsByUserId(currentUser.id);
            setApplications(apps);
        } catch (error) {
            console.error("Failed to refresh applications:", error);
        }
    };

    // Check if the user has already applied for the course
    const hasAppliedForRole = (courseId: number, role: "tutor" | "lab_assistant"): boolean => {
        return applicationLookup.has(`${courseId}-${role}`);
    };

    return (
        <div>
            {isApplicantFormOpen && selectedCourse && selectedRole && (
                <ApplicantForm closeForm={closeApplicantForm} course={selectedCourse} positionType={selectedRole} onApplicationSubmitted={refreshApplications}/>
            )}
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
                                <HStack p={4}>
                                    <Button
                                        onClick={() => handleApplicantClick(course, "tutor")}
                                        disabled={hasAppliedForRole(course.id, "tutor")}
                                    >
                                    {hasAppliedForRole(course.id, "tutor") ? "Applied as Tutor" : "Apply as Tutor"}
                                    </Button>

                                    <Button
                                        onClick={() => handleApplicantClick(course, "lab_assistant")}
                                        disabled={hasAppliedForRole(course.id, "lab_assistant")}
                                    >
                                    {hasAppliedForRole(course.id, "lab_assistant") ? "Applied as Lab Assistant" : "Apply as Lab Assistant"}
                                    </Button>
                                </HStack>
                            </Card.Footer>
                        </Box>
                    </Card.Root>
                ))}
            </Stack>
        </div>
    );
};

export default TutorPage;