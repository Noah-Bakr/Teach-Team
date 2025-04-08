import LecturerPage from "@/pages/lecturer";
import TutorPage from "@/pages/tutor";
import { useAuth } from "@/context/AuthContext";
import { Applicant } from "@/types/types";
import { useEffect, useState } from "react";
import { DEFAULT_APPLICANTS } from "@/types/testData";


const DashboardPage: React.FC = () => {
    const [applications, setApplications] = useState<Applicant[]>([]);

    useEffect(() => {
    // Initialize applications from localStorage or use defaults
    const storedApplicants = localStorage.getItem("applications");
    if (!storedApplicants) {
        localStorage.setItem("applications", JSON.stringify(DEFAULT_APPLICANTS));
        setApplications(DEFAULT_APPLICANTS);
    } else {
        setApplications(JSON.parse(storedApplicants));
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