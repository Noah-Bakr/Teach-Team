import LecturerPage from "@/pages/lecturer";
import { useAuth } from "@/context/AuthContext";

const DashboardPage: React.FC = () => {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <div>Please log in to view this page.</div>;
    }

    if (currentUser.role === "lecturer") {
        return (<LecturerPage />);
    }

    return (
        <div>Please log in to view this page.</div>
    );
    
};

export default DashboardPage;