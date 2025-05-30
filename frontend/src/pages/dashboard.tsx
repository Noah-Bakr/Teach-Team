import LecturerPage from "@/pages/lecturer";
import TutorPage from "@/pages/tutor";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { authApi } from "@/services/api";

const DashboardPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
        if (!currentUser) return;

        try {
            const userData = await authApi.getUserById(currentUser.id);
            setUserRole(userData.role?.role_name || null);
        } catch (error) {
            console.error("Failed to fetch user role:", error);
            setUserRole(null);
        } finally {
            setLoading(false);
        }
        };

        fetchUserRole();
    }, [currentUser]);

    if (!currentUser || loading) {
        return <div>Loading user data...</div>;
    }

    if (userRole === "lecturer") {
        return <LecturerPage />;
    }

    if (userRole === "candidate") {
        return <TutorPage />;
    }

    return <div>Unauthorized: Role not recognized.</div>;
};

export default DashboardPage;
