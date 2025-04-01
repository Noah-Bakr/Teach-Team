import LecturerPage from "@/pages/lecturer";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <div>Please log in to view this page.</div>;
    }

    if (currentUser.role === "admin") {
        return (<LecturerPage />);
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <LecturerPage />
        </div>
    );
};