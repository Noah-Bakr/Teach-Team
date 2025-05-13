import LecturerPage from "@/pages/lecturer";
import TutorPage from "@/pages/tutor";
import { useAuth } from "@/context/AuthContext";
import { Applicant } from "@/types/types";
import { useEffect, useState } from "react";

const DashboardPage: React.FC = () => {
    const [applications, setApplications] = useState<Applicant[]>([]);

    // Read applicants from localStorage
    useEffect(() => {
        const storedApplicants = localStorage.getItem("applicants");
        if (storedApplicants) {
            setApplications(JSON.parse(storedApplicants));
        } else {
            // Fallback in case of error (should not occur because DataInitializer is used)
            setApplications([]);
        }
    }, []);


    const { currentUser } = useAuth();

    if (!currentUser) {
        return <div>Please log in to view this page.</div>;
    }

    if (currentUser.role.includes("lecturer")) {
        return (<LecturerPage />);
    }

    if (currentUser.role.includes("tutor")) {
        return (<TutorPage />);
    }

    return (
        <div>Please log in to view this page.</div>
    );
    
};

export default DashboardPage;