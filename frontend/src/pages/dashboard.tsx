import React from "react";
import LecturerPage from "@/pages/lecturer";
import TutorPage from "@/pages/tutor";
import { useAuth } from "@/context/AuthContext";

const DashboardPage: React.FC = () => {
    const { currentUser, loading } = useAuth();

    // While AuthContext is still fetching /auth/me, show a loading state
    if (loading) {
        return <div>Loading user data...</div>;
    }

    // If no user object
    if (!currentUser) {
        return <div>Not authenticated. Please sign in.</div>;
    }

    // branch on role:
    switch (currentUser.role) {
        case "lecturer":
            return <LecturerPage />;
        case "candidate":
            return <TutorPage />;
       // add admin here
        default:
            return <div>Unauthorised: Role not recognized.</div>;
    }
};

export default DashboardPage;
