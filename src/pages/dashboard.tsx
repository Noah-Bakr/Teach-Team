import LecturerPage from "@/pages/lecturer";
import TutorPage from "@/pages/tutor";
import { useAuth } from "@/context/AuthContext";

const DashboardPage: React.FC = () => {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <div>Please log in to view this page.</div>;
    }

    if (currentUser.role === "lecturer") {
        return (<LecturerPage />);
    }

    if (currentUser.role === "tutor") {
        return (<TutorPage />);
    }

    return (
        <div>Please log in to view this page.</div>
    );
    
};

export default DashboardPage;