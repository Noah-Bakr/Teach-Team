import React from "react";
import LecturerPage from "@/pages/lecturer";
import TutorPage from "@/pages/tutor";
import { useAuth } from "@/context/AuthContext";

const DashboardPage: React.FC = () => {
    // Pull currentUser and loading directly from AuthContext
    const { currentUser, loading } = useAuth();

    // While AuthContext is still fetching /auth/me, show a loading state
    if (loading) {
        return <div>Loading user data...</div>;
    }

    // If, after loading, there is no user object, redirect or show a message
    if (!currentUser) {
        return <div>Not authenticated. Please sign in.</div>;
    }

    // Now that we know the user is authenticated, branch on role:
    switch (currentUser.role) {
        case "lecturer":
            return <LecturerPage />;
        case "candidate":
            return <TutorPage />;
        // (If you ever have more roles, add them here)
        default:
            return <div>Unauthorized: Role not recognized.</div>;
    }
};

export default DashboardPage;


// import LecturerPage from "@/pages/lecturer";
// import TutorPage from "@/pages/tutor";
// import { useAuth } from "@/context/AuthContext";
// import { useEffect, useState } from "react";
// import { getCurrentUser } from "@/services/authService";
// import { fetchUserById } from "@/services/userService";
// import { UserUI } from "@/types/userTypes";
//
//
// const DashboardPage: React.FC = () => {
//     // const { currentUser } = useAuth();
//     const [userRole, setUserRole] = useState<string | null>(null);
//     const [loading, setLoading] = useState(true);
//
//     // useEffect(() => {
//     //     const fetchUserRole = async () => {
//     //     if (!currentUser) return;
//
//     //     try {
//     //         const userData = await getUserById(currentUser.id);
//     //         setUserRole(userData.role?.role_name || null);
//     //     } catch (error) {
//     //         console.error("Failed to fetch user role:", error);
//     //         setUserRole(null);
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     //     };
//
//     //     fetchUserRole();
//     // }, [currentUser]);
//
//     // Fetch current user ID from /auth/me and then fetch user data from /user/:id
//         useEffect(() => {
//             const fetchUserData = async () => {
//                 try {
//                     const response = await getCurrentUser();
//                     console.log("Current user data fetched:", response);
//
//                     const user: UserUI = {
//                         id: response.id,
//                         username: response.username,
//                         firstName: response.firstName,
//                         lastName: response.lastName,
//                         email: response.email,
//                         avatar: response.avatar || null,
//                         role: response.role || "candidate",
//                         skills: response.skills || [],
//                         courses: response.courses || [],
//                         previousRoles: response.previousRoles || [],
//                         academicCredentials: response.academicCredentials || [],
//                     };
//
//                     setUserRole(user.role || null);
//                 } catch (error) {
//                     console.error("Failed to fetch user role:", error);
//                     setUserRole(null);
//                 } finally {
//                     setLoading(false);
//                 }
//             };
//
//             fetchUserData();
//         }, []);
//
//     if (loading) {
//         return <div>Loading user data...</div>;
//     }
//
//     if (userRole === "lecturer") {
//         return <LecturerPage />;
//     }
//
//     if (userRole === "candidate") {
//         return <TutorPage />;
//     }
//
//     return <div>Unauthorized: Role not recognized.</div>;
// };
//
// export default DashboardPage;
